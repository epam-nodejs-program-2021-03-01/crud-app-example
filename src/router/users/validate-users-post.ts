import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator, ContainerTypes, ValidatedRequestSchema, ValidatedRequest } from "express-joi-validation";

/** @private */
interface RequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: {
		login: string;
		password: string;
		age: number;
	};
}

export type ValidRequest = ValidatedRequest<RequestSchema>;

/** @private */
// Validate req.body for "POST /users" requests
const validateBody = createValidator().body(Joi.object({
	login: Joi.string()
		.required()
		.min(1)
		.max(32)
		.pattern(/^[a-zA-Z][-a-zA-Z0-9]+$/),

	password: Joi.string()
		.required()
		.pattern(/[a-z]/)
		.pattern(/[A-Z]/)
		.pattern(/[0-9]/),

	age: Joi.number()
		.required()
		.min(4)
		.max(130),
}));

export default (): RequestHandler[] => [
	validateBody,
];
