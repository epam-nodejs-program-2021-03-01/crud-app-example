import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator, ContainerTypes, ValidatedRequestSchema, ValidatedRequest } from "express-joi-validation";

/** @private */
interface RequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		"login-substring"?: string;
		limit?: number;
	};
}

export type ValidRequest = ValidatedRequest<RequestSchema>;

/** @private */
// Validate req.query for `.route("/").get()` requests
const validateQuery = createValidator().query(Joi.object({
	"login-substring": Joi.string()
		.optional()
		.allow(""),

	limit: Joi.number()
		.optional()
		.positive()
		.integer()
		.allow(""),
}));

export default (): RequestHandler[] => [
	validateQuery,
];
