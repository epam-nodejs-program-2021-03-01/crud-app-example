import type { ErrorRequestHandler, RequestHandler } from "express";
import { CelebrateError } from "celebrate";
import Service from "../services/abstract.service";

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

/** @public */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (): ErrorRequestHandler => async (error: unknown, req, res, next) => {
	console.error(error);

	const { statusCode, details } = createErrorResponseData(error);

	res.status(statusCode).json({
		message: createErrorMessage(error, req),
		details,
		statusCode,
	});
};

export default errorHandler;
