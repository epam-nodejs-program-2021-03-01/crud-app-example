import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import type DefineValidRequest from "../../typings/define-valid-request";

export type ValidRequest = DefineValidRequest<"query", {
	"login-substring"?: string;
	limit?: number;
}>;

/** @private */
// Validate req.query for "GET /users" requests
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
