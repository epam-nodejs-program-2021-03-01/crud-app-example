import type { Request, RequestHandler } from "express";
import morgan from "morgan";
import logger from "../log/logger";

morgan.token("id", (req: Request) => req.id);

/** @public */
const httpLogger = (): RequestHandler => morgan(":method :url :id - :status :response-time ms", {
	stream: {
		write(log) {
			logger.info(log.replace(/\n$/, ""));
		},
	},
});

export default httpLogger;
