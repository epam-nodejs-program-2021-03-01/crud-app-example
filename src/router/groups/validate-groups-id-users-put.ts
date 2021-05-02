import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import type DefineValidRequest from "../../typings/define-valid-request";

export type ValidRequest = DefineValidRequest<{
	userIDs: string[];
}>;

export const props = {
	userIDs: Joi.array().items(
		Joi.number() // yes, number here, string in the type
			.positive()
			.integer()
	),
};

/** @private */
// Validate req.body for "PUT /groups/:id/users" requests
const validateBody = createValidator().body(Joi.object({
	userIDs: props.userIDs.required(),
}));

export default (): RequestHandler[] => [
	validateBody,
];
