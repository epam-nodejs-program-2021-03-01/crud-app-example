import type { ErrorRequestHandler, RequestHandler } from "express";
import { CelebrateError } from "celebrate";
import Service from "../services/abstract.service";
import logger from "../log/logger";

/** @private */
// This type does not require all of the properties of Request
// in order to allow providing mocked request / custom object
// without getting a compilation error due to missing properties
type Req = Pick<Parameters<RequestHandler>[0], "id" | "method" | "originalUrl">;

/** @private */
type DetailKind =
	| "message"
	| "request_id"
	;

/** @private */
interface Detail {
	kind: DetailKind;
	description: string;
}

export interface ErrorResponse {
	message: string;
	statusCode: number;
	details: Detail[];
}

/** @private */
type ErrorResponseData = Omit<ErrorResponse, "message">;

/** @private */
function createDetailsFromCelebrateError(error: CelebrateError): Detail[] {
	const details: Detail[] = [];

	for (const [ scope, joiError ] of error.details)
		details.push({
			kind: "message",
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
					kind: "message",
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
				kind: "message",
				description: "Unknown error occurred",
			},
		],
	};
}

/** @private */
function createErrorMessage(error: unknown, req: Req): string {
	return `Request "${req.method} ${req.originalUrl}" failed`;
}

/** @private */
function createErrorResponse(error: unknown, req: Req): ErrorResponse {
	const { statusCode, details } = createErrorResponseData(error);

	details.push({
		kind: "request_id",
		description: `Request ID: ${req.id}`,
	});

	return {
		message: createErrorMessage(error, req),
		details,
		statusCode,
	};
}

/** @private */
function logError(error: unknown): void {
	let message: unknown;

	if (error instanceof CelebrateError)
		message = createDetailsFromCelebrateError(error)
			.filter(({ kind }) => kind === "message")
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

	const response = createErrorResponse(error, req);

	res.status(response.statusCode).json(response);
};

export default errorHandler;
