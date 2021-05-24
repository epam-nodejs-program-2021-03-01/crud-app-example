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
	@Logged({ level: "debug", mapArgs: "hide" })
	protected createDetailsFromCelebrateError(error: CelebrateError): Detail[] {
		const details: Detail[] = [];

		for (const [ scope, joiError ] of error.details)
			details.push({
				kind: "message",
				description: `(in ${scope}) ${joiError.message}`,
			});

		return details;
	}

	@Logged({ level: "debug", mapArgs: "hide" })
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

	@Logged({ level: "debug", mapArgs: "hide" })
	protected createErrorMessage(error: unknown, req: Req): string {
		return `Request "${req.method} ${req.originalUrl}" failed`;
	}

	@Logged({ level: "debug", mapArgs: "hide" })
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

	@Logged({ level: "debug", mapArgs: "hide" })
	protected createLogMessageFromCelebrateError(error: CelebrateError): string {
		return this.createDetailsFromCelebrateError(error)
			.filter(({ kind }) => kind === "message")
			.map(({ description }) => description)
			.join(", ");
	}

	@Logged({ level: "debug", mapArgs: "hide" })
	protected createLogMessage(error: unknown): string | unknown {
		if (error instanceof Service.Error)
			return `${error.name} (status ${error.statusCode}): ${error.message}`;

		if (error instanceof CelebrateError)
			return this.createLogMessageFromCelebrateError(error);

		return error;
	}

	@Logged({ level: "debug", mapArgs: "hide" })
	logError(error: unknown): void {
		const message = this.createLogMessage(error);

		logger.error(message);
	}
}
