import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import type DefineValidRequest from "../../typings/define-valid-request";
import type { UserTypeRequired } from "../../db/models/user";

export type ValidRequest = DefineValidRequest<UserTypeRequired>;

export const props = {
	login: Joi.string()
		.min(1)
		.max(32)
		.pattern(/^[a-zA-Z][-a-zA-Z0-9]+$/),

	password: Joi.string()
		.pattern(/[a-z]/)
		.pattern(/[A-Z]/)
		.pattern(/[0-9]/),

	age: Joi.number()
		.min(4)
		.max(130),
} as const;

/** @private */
// Validate req.body for "PATCH /users:/id" requests
const validateBody = createValidator().body(Joi.object(props));

export default (): RequestHandler[] => [
	validateBody,
];
