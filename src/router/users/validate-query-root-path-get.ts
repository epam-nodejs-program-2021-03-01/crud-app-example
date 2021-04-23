import Joi from "joi";
import { createValidator, ContainerTypes, ValidatedRequestSchema, ValidatedRequest } from "express-joi-validation";
import type { RequestHandler } from "express";

/** @private */
interface RequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		"login-substring"?: string;
		limit?: number;
	};
}

export type ValidRequest = ValidatedRequest<RequestSchema>;

// Validate req.query for `.route("/").get()` requests
export default (): RequestHandler => createValidator().query(Joi.object({
	"login-substring": Joi.string()
		.optional()
		.allow(""),

	limit: Joi.number()
		.optional()
		.positive()
		.integer()
		.allow(""),
}));
