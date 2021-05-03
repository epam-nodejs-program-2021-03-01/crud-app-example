import type { RequestHandler } from "express";
import Service from "../services/abstract.service";

/** @private */
interface Handler {
	(...args: Parameters<RequestHandler>): void | PromiseLike<void>;
}

/** @private */
// this helps reducing line length
type Params = [ actionName: string, handler: Handler ];

/** @public */
const handleAsyncErrors = (...args: Params): RequestHandler => async (req, res, next) => {
	const [ actionName, handler ] = args;

	try {
		await handler(req, res, next);
	} catch (error: unknown) {
		if (error instanceof Service.Error)
			return res.status(error.statusCode).json({
				error: `Could not ${actionName}`,
				message: error.message,
			});

		next(error);
	}
};

export default handleAsyncErrors;
