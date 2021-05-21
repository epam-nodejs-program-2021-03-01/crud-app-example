import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type { UserTypeCreation } from "../../db/models/user";
import type UserService from "../../services/user.service";
import RequestValidation, { Joi } from "../request-validation";
import { userLogin, userPassword, userAge } from "./definitions";

/** @private */
interface Deps {
	userService: UserService;
}

/** @private */
const { requestValidator, request } = new RequestValidation<Partial<UserTypeCreation>>({
	[Segments.BODY]: Joi.object<Partial<UserTypeCreation>>({
		login: userLogin,
		password: userPassword,
		age: userAge,
	}),
});

export default function updateUser({ userService }: Deps): RequestHandler[] {
	return [
		requestValidator,
		async (req: typeof request, res) => {
			const userID = req.params.id;
			const user = await userService.update(userID, req.body);

			res.json(user);
		},
	];
}
