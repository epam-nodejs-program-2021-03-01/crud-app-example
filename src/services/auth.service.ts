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
const secret = process.env.JWT_TOKEN_SECRET;

export default class AuthService extends Service {
	private jwtSignOptions: jwt.SignOptions = {
		expiresIn: "1 day",
	};

	@Logged()
	issueToken<Data extends object>(data?: Data): TokenIssue {
		const now = new Date();
		const payload = {
			...data,
			iat: Math.floor(now.getTime() / 1000),
		};

		const token = jwt.sign(payload, secret, this.jwtSignOptions);
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
	getPayload(token: Token): unknown {
		try {
			return jwt.verify(token, secret);
		} catch (error: unknown) {
			if (error instanceof jwt.TokenExpiredError)
				throw new AuthTokenExpiredError(error.expiredAt);

			if (error instanceof jwt.JsonWebTokenError)
				throw new AuthUnknownError(error);

			throw error;
		}
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
