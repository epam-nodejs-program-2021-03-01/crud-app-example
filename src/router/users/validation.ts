import { celebrate, Joi, Segments } from "celebrate";
import type { UserTypeRequired } from "../../db/models/user";
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
	export type CreateUser = DefineValidRequest<UserTypeRequired>;
	export type UpdateUser = DefineValidRequest<Partial<UserTypeRequired>>;
}

export namespace validators {
	export const forGetUsers = celebrate({
		[Segments.QUERY]: Joi.object<GetUsersQuery>({
			"login-substring": userLoginSubstring.allow(""),
			limit: naturalNumber.allow(""),
		}),
	});

	export const forCreateUser = celebrate({
		[Segments.BODY]: Joi.object<UserTypeRequired>({
			login: name.required(),
			password: userPassword.required(),
			age: userAge.required(),
		}),
	});

	export const forUpdateUser = celebrate({
		[Segments.BODY]: Joi.object<Partial<UserTypeRequired>>({
			login: name,
			password: userPassword,
			age: userAge,
		}),
	});
}
