import { CelebrateError } from "celebrate";
import type { RequestHandler } from "express";
import Logged from "../log/logged.decorator";
import logger from "../log/logger";
import Service from "./abstract.service";

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

export default class HttpErrorService extends Service {
	@Logged({ level: "debug", hideArgs: true })
	protected createDetailsFromCelebrateError(error: CelebrateError): Detail[] {
		const details: Detail[] = [];

		for (const [ scope, joiError ] of error.details)
			details.push({
				kind: "message",
				description: `(in ${scope}) ${joiError.message}`,
			});

		return details;
	}

	@Logged({ level: "debug", hideArgs: true })
	protected createErrorResponseData(error: unknown): ErrorResponseData {
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
				details: this.createDetailsFromCelebrateError(error),
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

	@Logged({ level: "debug", hideArgs: true })
	protected createErrorMessage(error: unknown, req: Req): string {
		return `Request "${req.method} ${req.originalUrl}" failed`;
	}

	@Logged({ level: "debug", hideArgs: true })
	createErrorResponse(error: unknown, req: Req): ErrorResponse {
		const { statusCode, details } = this.createErrorResponseData(error);

		details.push({
			kind: "request_id",
			description: `Request ID: ${req.id}`,
		});

		return {
			message: this.createErrorMessage(error, req),
			details,
			statusCode,
		};
	}

	@Logged({ level: "debug", hideArgs: true })
	logError(error: unknown): void {
		let message: unknown;

		if (error instanceof CelebrateError)
			message = this.createDetailsFromCelebrateError(error)
				.filter(({ kind }) => kind === "message")
				.map(({ description }) => description)
				.join(", ");

		else if (error instanceof Service.Error)
			message = `${error.name} (status ${error.statusCode}): ${error.message}`;

		else
			message = error;

		logger.error(message);
	}
}
