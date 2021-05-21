import { Joi } from "./request-validation";

export const name = Joi.string()
	.pattern(/^[a-zA-Z][-a-zA-Z0-9]*$/, { name: "alpha-numeric characters" })
	.min(1)
	.max(32);

export const naturalNumber = Joi.number()
	.positive()
	.integer();
