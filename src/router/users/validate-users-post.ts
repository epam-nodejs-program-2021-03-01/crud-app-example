import type { RequestHandler } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { props } from "./validate-users-id-patch";

export { ValidRequest } from "./validate-users-id-patch";

/** @private */
// Validate req.body for "POST /users" requests
const validateBody = createValidator().body(Joi.object({
	login: props.login.required(),
	password: props.password.required(),
	age: props.age.required(),
}));

export default (): RequestHandler[] => [
	validateBody,
];
