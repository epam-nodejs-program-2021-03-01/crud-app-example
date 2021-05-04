import createValidator, { Joi, Segments } from "../create-validator";
import type { UserTypeCreation } from "../../db/models/user";
import { name, naturalNumber } from "../definitions";
import type DefineValidRequest from "../define-valid-request.type";

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

export namespace requests {
	export type GetUsers = DefineValidRequest<unknown, GetUsersQuery>;
	export type CreateUser = DefineValidRequest<UserTypeCreation>;
	export type UpdateUser = DefineValidRequest<Partial<UserTypeCreation>>;
}

export namespace validators {
	export const forGetUsers = createValidator({
		[Segments.QUERY]: Joi.object<GetUsersQuery>({
			"login-substring": userLoginSubstring.allow(""),
			limit: naturalNumber.allow(""),
		}),
	});

	export const forCreateUser = createValidator({
		[Segments.BODY]: Joi.object<UserTypeCreation>({
			login: name.required(),
			password: userPassword.required(),
			age: userAge.required(),
		}),
	});

	export const forUpdateUser = createValidator({
		[Segments.BODY]: Joi.object<Partial<UserTypeCreation>>({
			login: name,
			password: userPassword,
			age: userAge,
		}),
	});
}
