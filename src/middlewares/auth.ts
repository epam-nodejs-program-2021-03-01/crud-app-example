import type { Request, RequestHandler } from "express";
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
type Path = `/${string}`;

/** @private */
type RequestDescription = `${HttpMethod} ${Path}`;

/** @private */
interface AuthParams {
	skipRequests?: RequestDescription[];
}

/** @private */
const authService = new AuthService();

/** @private */
function describe(req: Request): RequestDescription {
	return `${req.method} ${req.path}` as RequestDescription;
}

export default function auth({ skipRequests = [] }: AuthParams = {}): RequestHandler {
	const skipped = new Set<RequestDescription>(skipRequests);

	return (req, res, next): void => {
		if (!skipped.has(describe(req))) {
			const token = authService.getToken(req);

			req.token = token;
			req.payload = authService.getPayload(token);
		}

		next();
	};
}
