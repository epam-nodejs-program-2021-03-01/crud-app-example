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

/** @private */
const jwtTokenLifespans = {
	access: "30 seconds",
	// TODO: refresh: "1 week",
} as const;

/** @private */
type JwtTokenType = keyof typeof jwtTokenLifespans;

/** @private */
type TokenNominal<Type extends JwtTokenType> = string & {
	/** @deprecated This doesn't exist in runtime */
	readonly __kind__: unique symbol;

	/** @deprecated This doesn't exist in runtime */
	readonly __type__: Type;
};

export type AccessToken = TokenNominal<"access">;
// TODO: export type RefreshToken = TokenNominal<"refresh">;

/** @private */
type PayloadData<Type extends JwtTokenType> = (Type extends "refresh" ? unknown /* TODO: {
	userLogin: string;
	tokenID: string;
} */ : unknown);

/** @private */
type Payload<Type extends JwtTokenType = JwtTokenType> = {
	[key: string]: unknown;
	tokenType: Type;
	data?: PayloadData<Type>;
};

/** @private */
interface IssuedToken<Type extends JwtTokenType> {
	type: Type;
	value: TokenNominal<Type>;
	issuedAt: Date;
	expiresAt: Date | null;
}

/** @private */
type IssuedTokens = {
	accessToken: IssuedToken<"access">;
	// TODO: refreshToken: IssuedToken<"refresh">;
};

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

		// TODO: return { login, password };
	}

	@Logged({ level: "debug" })
	protected sign<Type extends JwtTokenType>(payload: Payload<Type>, options?: jwt.SignOptions): TokenNominal<Type> {
		return jwt.sign(payload, secret, options) as TokenNominal<Type>;
	}

	@Logged({ level: "debug" })
	protected issueToken<Type extends JwtTokenType>(type: Type, data?: PayloadData<Type>): IssuedToken<Type> {
		const now = Date.now();
		const lifespan: string = jwtTokenLifespans[type];
		const token = this.sign<Type>({
			data,
			tokenType: type,
			iat: sec(now),
		}, {
			expiresIn: lifespan,
		});

		return {
			type,
			value: token,
			issuedAt: new Date(now),
			expiresAt: new Date(now + ms(lifespan)),
		};
	}

	@Logged()
	async login(auth: string | undefined, data?: unknown): Promise<IssuedTokens> {
		/* TODO: const { login } = */ await this.validateCreds(auth);

		const accessToken = this.issueToken("access", data);
		// TODO: const refreshToken = this.issueToken("refresh" /* TODO: { tokenID: refreshTokenID, userLogin: login } */);

		// TODO: in DB, store the fact that a refresh token with this ID is associated with a user with ${login} login
		// TODO: if the user already have an associated refresh token, remove it prior to that

		return {
			accessToken,
			// TODO: refreshToken,
		};
	}

	@Logged({ level: "debug" })
	protected extractPayload<Type extends JwtTokenType>(type: Type, token: string): Payload<Type> {
		try {
			return jwt.verify(token, secret, { clockTolerance: 1 }) as Payload<Type>;
		} catch (error: unknown) {
			if (error instanceof jwt.TokenExpiredError)
				throw new AuthTokenExpiredError(type, error.expiredAt);

			if (error instanceof jwt.JsonWebTokenError)
				throw new AuthJwtError(error);

			throw error;
		}
	}

	@Logged()
	parseToken<Type extends JwtTokenType>(type: Type, auth: string | undefined): PayloadData<Type> | undefined {
		const token = this.parseAuthValue("Bearer", auth);
		const payload = this.extractPayload(type, token);

		if (typeof payload !== "object")
			throw new AuthTokenPayloadUnknownError(payload, "payload is not of an object type");

		if ("tokenType" in payload === false)
			throw new AuthTokenPayloadUnknownError(payload, "tokenType property is missing");

		AuthTokenTypeUnexpectedError.throwIfNotEqual(payload.tokenType, type);

		return payload.data;
	}

	@Logged()
	async renew(/* TODO: auth: string | undefined */): Promise<void> {
		/* TODO:
		const data = this.parseToken("refresh", auth);

		if (typeof data !== "object" || "tokenID" in data === false)
			throw new AuthTokenPayloadUnknownError({ data }, "tokenID property is missing in payload data of refresh token");
		*/

		// TODO: check that token payload data object contains userLogin property

		// TODO: in DB, check that user with ${data.userLogin} login has an associated refresh token with ${data.tokenID} ID
		// TODO: if not, throw a AuthRefreshTokenUnknownError error
		// TODO: otherwise, issue a new access token
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

export class AuthTokenTypeUnexpectedError extends Service.Error {
	statusCode = 403;

	@Logged({ level: "debug" })
	static throwIfNotEqual<Type extends JwtTokenType>(type: JwtTokenType, expected: Type): asserts type is Type {
		if (type !== expected)
			throw new AuthTokenTypeUnexpectedError(type, expected);
	}

	constructor(actual: JwtTokenType, expected: JwtTokenType) {
		super(`Unexpected JWT token type: expected ${expected} token, got ${actual} token`);
	}
}

export class AuthTokenPayloadUnknownError extends Service.Error {
	statusCode = 403;

	constructor(
		public payload: unknown,
		public hint: string,
	) {
		super("Refusing to verify token with unexpected payload");
	}
}

export class AuthTokenExpiredError extends Service.Error {
	statusCode = 403;

	@Logged({ level: "debug" })
	private static calcTimeAgo(then: Date): string {
		return ms(Date.now() - then.getTime(), { long: true });
	}

	constructor(type: JwtTokenType, expiration: Date) {
		super(`The supplied ${type} token has expired ${AuthTokenExpiredError.calcTimeAgo(expiration)} ago`);
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
