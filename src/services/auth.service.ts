import type { Request } from "express";
import ms from "ms";
import jwt from "jsonwebtoken";
import Logged from "../log/logged.decorator";
import Service from "./abstract.service";

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
interface IssueTokenParams<Data extends object> {
	data?: Data | {};
	lifespan?: string;
}

/** @private */
const secret = process.env.JWT_TOKEN_SECRET;

/** @private */
const jwtBearerTokenPattern = /^Bearer [\w=-]+\.[\w=-]+(?:\.[\w/.+=-]+)?$/;

/** @private */
function sec(msec: number): number {
	return Math.floor(msec / 1000);
}

export default class AuthService extends Service {
	@Logged({ level: "debug" })
	private validateLifespan(lifespan: string | undefined): asserts lifespan is string {
		if (lifespan == null)
			throw new AuthInvalidLifespanError(String(lifespan));

		const lifespanMsec = ms(lifespan);

		if (typeof lifespanMsec !== "number" || !isFinite(lifespanMsec))
			throw new AuthInvalidLifespanError(lifespan);
	}

	@Logged()
	issueToken<Data extends object>({
		data = {},
		lifespan = "1 day",
	}: IssueTokenParams<Data> = {}): TokenIssue {
		this.validateLifespan(lifespan);

		const now = new Date();
		const payload = {
			...data,
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
	getToken(req: Request): Token {
		const auth = req.header("Authorization");

		if (!auth)
			throw new AuthHeaderMissingError();

		const [ type, token ] = auth.split(" ");

		if (type !== "Bearer")
			throw new AuthHeaderUnknownTypeError(type);

		if (!token)
			throw new AuthHeaderMissingError();

		if (!jwtBearerTokenPattern.test(token))
			throw new AuthHeaderInvalidValueError(token);

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
				throw new AuthUnknownError(error);

			throw error;
		}
	}
}

export class AuthHeaderMissingError extends Service.Error {
	statusCode = 400;

	constructor() {
		super('The "Authorization" header is missing in the request, or its value is empty');
	}
}

export class AuthHeaderUnknownTypeError extends Service.Error {
	statusCode = 400;

	constructor(type: string) {
		super(`Invalid type of "Authorization" token: "${type}" (expected "Bearer")`);
	}
}

export class AuthHeaderInvalidValueError extends Service.Error {
	statusCode = 400;

	constructor(token: string) {
		super(`Invalid "Authorization" header value: "${token}" (expected a JWT token)`);
	}
}

export class AuthInvalidLifespanError extends Service.Error {
	statusCode = 400;

	constructor(lifespan: string) {
		super(`Could not parse supplied lifespan pattern: "${lifespan}"`);
	}
}

export class AuthTokenExpiredError extends Service.Error {
	statusCode = 401;

	constructor(expiration: Date) {
		super(`The supplied token has already expired (expiration date: ${expiration.toUTCString()})`);
	}
}

export class AuthUnknownError extends Service.Error {
	statusCode = 403;

	constructor(
		public cause: jwt.JsonWebTokenError,
	) {
		super("Unknown authorization error");
	}
}
