import type { RequestHandler } from "express";
import type { HttpMethod } from "express-allow-methods";
import AuthService, { Token } from "../services/auth.service";

declare global {
	namespace Express {
		interface Request {
			token?: Token;
			payload?: unknown;
		}
	}
}

/** @private */
interface RequestDescription {
	method: HttpMethod;
	path: string;
}

/** @private */
interface AuthedParams {
	skipRequests?: RequestDescription[];
}

/** @private */
const authService = new AuthService();

export default function authed({ skipRequests = [] }: AuthedParams = {}): RequestHandler {
	const skipped = new Set<string>();

	for (const { method, path } of skipRequests)
		skipped.add(`${method} ${path}`);

	return (req, res, next): void => {
		if (!skipped.has(`${req.method} ${req.path}`)) {
			const token = authService.getToken(req);

			req.token = token;
			req.payload = authService.getPayload(token);
		}

		next();
	};
}
