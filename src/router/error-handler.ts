import type { ErrorRequestHandler, RequestHandler } from "express";
import { CelebrateError } from "celebrate";
import Service from "../services/abstract.service";
import logger from "../log/logger";

/** @private */
interface Detail {
	description: string;
}

/** @private */
interface ErrorResponseData {
	statusCode: number;
	details: Detail[];
}

/** @private */
function createDetailsFromCelebrateError(error: CelebrateError): Detail[] {
	const details: Detail[] = [];

	for (const [ scope, joiError ] of error.details)
		details.push({
			description: `(in ${scope}) ${joiError.message}`,
		});

	return details;
}

/** @private */
function createErrorResponseData(error: unknown): ErrorResponseData {
	if (error instanceof Service.Error)
		return {
			statusCode: error.statusCode,
			details: [
				{
					description: error.message,
				},
			],
		};

	if (error instanceof CelebrateError) {
		return {
			statusCode: 400,
			details: createDetailsFromCelebrateError(error),
		};
	}

	return {
		statusCode: 500,
		details: [
			{
				description: "Unknown error occurred",
			},
		],
	};
}

/** @private */
function createErrorMessage(error: unknown, req: Parameters<RequestHandler>[0]): string {
	return `Request "${req.method} ${req.originalUrl}" failed`;
}

/** @private */
function logError(error: unknown): void {
	let message: unknown;

	if (error instanceof CelebrateError)
		message = createDetailsFromCelebrateError(error)
			.map(({ description }) => description)
			.join(", ");

	else if (error instanceof Service.Error)
		message = `${error.name} (status ${error.statusCode}): ${error.message}`;

	else
		message = error;

	logger.error(message);
}

/** @public */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (): ErrorRequestHandler => async (error: unknown, req, res, next) => {
	logError(error);

	const { statusCode, details } = createErrorResponseData(error);

	res.status(statusCode).json({
		message: createErrorMessage(error, req),
		details,
		statusCode,
	});
};

export default errorHandler;
