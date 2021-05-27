import ms from "ms";
import jwt from "jsonwebtoken";
import Logged from "../log/logged.decorator";
import type { UserType } from "../db/models/user";
import Service from "./abstract.service";

/** @private */
namespace Deps {
	export interface UserService extends Service {
		findByLogin(login: string): Promise<UserType | null>;
	}
}

/** @private */
interface Deps extends Service.Deps {
	userService?: Deps.UserService;
}

/** @private */
type AuthTokenType = "Bearer" | "Basic";

export type Token = string & {
	readonly __type__: unique symbol;
};

/** @private */
interface TokenIssue {
	token: Token;
	issuedAt: Date;
	expiresAt?: Date;
}

/** @private */
interface IssueTokenParams {
	data?: unknown;
	lifespan?: string;
}

/** @private */
const secret = process.env.JWT_TOKEN_SECRET;

/** @private */
function sec(msec: number): number {
	return Math.floor(msec / 1000);
}

export default class AuthService extends Service {
	constructor(deps?: Deps) {
		super(deps);
	}

	@Logged({ level: "debug" })
	private validateLifespan(lifespan: string | undefined): asserts lifespan is string {
		if (!lifespan)
			throw new AuthInvalidLifespanError(String(lifespan));

		const lifespanMsec = ms(lifespan);

		if (typeof lifespanMsec !== "number" || !isFinite(lifespanMsec))
			throw new AuthInvalidLifespanError(lifespan);
	}

	@Logged({ level: "debug" })
	protected parseAuthValue(expectedType: AuthTokenType, auth: string | undefined): string {
		if (!auth)
			throw new AuthHeaderMissingError();

		const [ type, value ] = auth.split(" ");

		AuthHeaderUnknownTypeError.throwIfNotEqual(type, expectedType);

		if (!value)
			throw new AuthHeaderMissingError();

		return value;
	}

	@Logged({ level: "debug" })
	protected async validateCreds(auth: string | undefined): Promise<void> {
		this.using<Deps, "userService">("userService");

		const credsRaw = this.parseAuthValue("Basic", auth);
		const creds = Buffer.from(credsRaw, "base64").toString("ascii");

		const [ login, password ] = creds.split(":");

		const user = await this.deps.userService.findByLogin(login);

		if (user == null || password !== user.password)
			throw new AuthCredentialsInvalidError(login);
	}

	@Logged()
	async issueToken(auth: string | undefined, {
		data,
		lifespan = "1 day",
	}: IssueTokenParams = {}): Promise<TokenIssue> {
		await this.validateCreds(auth);

		this.validateLifespan(lifespan);

		const now = new Date();
		const payload = {
			data,
			iat: sec(now.getTime()),
		};

		const token = jwt.sign(payload, secret, { expiresIn: lifespan });
		const issue: TokenIssue = {
			token: token as Token,
			issuedAt: now,
		};

		const decoded = jwt.decode(token);

		if (decoded != null && typeof decoded !== "string")
			if (typeof decoded.exp === "number")
				issue.expiresAt = new Date(decoded.exp * 1000);

		return issue;
	}

	@Logged()
	getToken(auth: string | undefined): Token {
		const token = this.parseAuthValue("Bearer", auth);

		return token as Token;
	}

	@Logged()
	getPayload(token: Token): unknown {
		try {
			return jwt.verify(token, secret, { clockTolerance: 1 });
		} catch (error: unknown) {
			if (error instanceof jwt.TokenExpiredError)
				throw new AuthTokenExpiredError(error.expiredAt);

			if (error instanceof jwt.JsonWebTokenError)
				throw new AuthJwtError(error);

			throw error;
		}
	}
}

export class AuthCredentialsInvalidError extends Service.Error {
	statusCode = 401;

	constructor(userLogin: string) {
		super(`Invalid credentials: the user "${userLogin}" does not exist, or the password is incorrect`);
	}
}

export class AuthHeaderMissingError extends Service.Error {
	statusCode = 401;

	constructor() {
		super('The "Authorization" header is missing in the request, or its value is empty');
	}
}

export class AuthHeaderUnknownTypeError extends Service.Error {
	statusCode = 401;

	@Logged({ level: "debug" })
	static throwIfNotEqual<Type extends AuthTokenType>(type: string, expected: Type): asserts type is Type {
		if (type !== expected)
			throw new AuthHeaderUnknownTypeError(type, expected);
	}

	constructor(type: string, expected: AuthTokenType = "Bearer") {
		super(`Invalid type of "Authorization" token: "${type}" (expected "${expected}")`);
	}
}

export class AuthInvalidLifespanError extends Service.Error {
	statusCode = 400;

	constructor(lifespan: string) {
		super(`Could not parse supplied lifespan pattern: "${lifespan}"`);
	}
}

export class AuthTokenExpiredError extends Service.Error {
	statusCode = 403;

	@Logged({ level: "debug" })
	private static calcTimeAgo(then: Date): string {
		return ms(Date.now() - then.getTime(), { long: true });
	}

	constructor(expiration: Date) {
		super(`The supplied token has expired ${AuthTokenExpiredError.calcTimeAgo(expiration)} ago`);
	}
}

export class AuthJwtError extends Service.Error {
	statusCode = 401;

	constructor(
		public cause: jwt.JsonWebTokenError,
	) {
		super(`Authorization error: ${cause.message}`);
	}
}
