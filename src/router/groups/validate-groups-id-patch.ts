import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import type DefineValidRequest from "../../typings/define-valid-request";
import { GroupTypeCreation, permissions } from "../../db/models/group";

export type ValidRequest = DefineValidRequest<GroupTypeCreation>;

export const props = {
	name: Joi.string()
		.min(1)
		.max(32)
		.pattern(/^[a-zA-Z][-a-zA-Z0-9]+$/),

	permissions: Joi.array().items(
		Joi.string()
			.allow(...permissions)
	),
} as const;

/** @private */
// Validate req.body for "PATCH /groups:/id" requests
const validateBody = createValidator().body(Joi.object(props));

export default (): RequestHandler[] => [
	validateBody,
];
