import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type { UserTypeCreation } from "../../db/models/user";
import UserService from "../../services/user.service";
import RequestValidation, { Joi } from "../request-validation";
import { userName, userPassword, userAge } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation<Partial<UserTypeCreation>>({
	[Segments.BODY]: Joi.object<Partial<UserTypeCreation>>({
		login: userName,
		password: userPassword,
		age: userAge,
	}),
});

export default function updateUser(): RequestHandler[] {
	const userService = new UserService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const userID = req.params.id;
			const user = await userService.update(userID, req.body);

			res.json(user);
		},
	];
}
