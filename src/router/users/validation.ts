import type { UserTypeCreation } from "../../db/models/user";
import { name, naturalNumber } from "../definitions";
import RequestValidation, { Joi, Segments } from "../request-validation";

/** @private */
interface GetUsersQuery {
	"login-substring"?: string;
	limit?: number;
}

/** @private */
const userLoginSubstring = Joi.string()
	.max(32);

/** @private */
const userPassword = Joi.string()
	.pattern(/[a-z]/, { name: "lowercase letters" })
	.pattern(/[A-Z]/, { name: "uppercase letters" })
	.pattern(/[0-9]/, { name: "digits" });

/** @private */
const userAge = Joi.number()
	.min(4)
	.max(130);

export const getUsers = new RequestValidation<unknown, GetUsersQuery>({
	[Segments.QUERY]: Joi.object<GetUsersQuery>({
		"login-substring": userLoginSubstring.allow(""),
		limit: naturalNumber.allow(""),
	}),
});

export const createUser = new RequestValidation<UserTypeCreation>({
	[Segments.BODY]: Joi.object<UserTypeCreation>({
		login: name.required(),
		password: userPassword.required(),
		age: userAge.required(),
	}),
});

export const updateUser = new RequestValidation<Partial<UserTypeCreation>>({
	[Segments.BODY]: Joi.object<Partial<UserTypeCreation>>({
		login: name,
		password: userPassword,
		age: userAge,
	}),
});
