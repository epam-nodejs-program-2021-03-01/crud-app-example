import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import type DefineValidRequest from "../../typings/define-valid-request";
import type { GroupTypeCreation } from "../../db/models/group";
import { props } from "./validate-groups-id-patch";

export type ValidRequest = DefineValidRequest<GroupTypeCreation>;

/** @private */
// Validate req.body for "POST /groups" requests
const validateBody = createValidator().body(Joi.object({
	name: props.name.required(),
	permissions: props.permissions.required(),
}));

export default (): RequestHandler[] => [
	validateBody,
];
