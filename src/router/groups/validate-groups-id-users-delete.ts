import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { props } from "./validate-groups-id-users-put";

export { props, ValidRequest } from "./validate-groups-id-users-put";

/** @private */
// Validate req.body for "DELETE /groups/:id/users" requests
const validateBody = createValidator().body(Joi.object({
	userIDs: props.userIDs.required(),
}));

export default (): RequestHandler[] => [
	validateBody,
];
