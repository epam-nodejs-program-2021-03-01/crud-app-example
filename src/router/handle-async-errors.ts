import type { RequestHandler } from "express";
import Service from "../services/abstract.service";

/** @private */
// this helps reducing line length
type Params = [ actionDescription: string, handler: RequestHandler ];

/** @public */
const handleAsyncErrors = (...args: Params): RequestHandler => async (req, res, next) => {
	const [ actionDescription, handler ] = args;

	try {
		await Promise.resolve(handler(req, res, next));
	} catch (error: unknown) {
		if (error instanceof Service.Error)
			return res.status(404).json({
				error: `Could not ${actionDescription}`,
				message: error.message,
			});

		next(error);
	}
};

export default handleAsyncErrors;
