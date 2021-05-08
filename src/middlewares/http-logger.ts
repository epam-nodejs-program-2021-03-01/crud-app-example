import type { RequestHandler } from "express";
import morgan from "morgan";
import logger from "../log/logger";

/** @public */
const httpLogger = (): RequestHandler => morgan("dev", {
	stream: {
		write(log) {
			logger.info(log.replace(/\n$/, ""));
		},
	},
});

export default httpLogger;
