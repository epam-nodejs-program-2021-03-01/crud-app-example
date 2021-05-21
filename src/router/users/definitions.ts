import { Joi } from "../request-validation";

export { name as userName } from "../definitions";

export const userLoginSubstring = Joi.string()
	.max(32);

export const userPassword = Joi.string()
	.pattern(/[a-z]/, { name: "lowercase letters" })
	.pattern(/[A-Z]/, { name: "uppercase letters" })
	.pattern(/[0-9]/, { name: "digits" });

export const userAge = Joi.number()
	.min(4)
	.max(130);
