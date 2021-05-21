import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type { UserTypeCreation } from "../../db/models/user";
import UserService from "../../services/user.service";
import RequestValidation, { Joi } from "../request-validation";
import { userAge, userLogin, userPassword } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation<UserTypeCreation>({
	[Segments.BODY]: Joi.object<UserTypeCreation>({
		login: userLogin.required(),
		password: userPassword.required(),
		age: userAge.required(),
	}),
});

export default function createUser(): RequestHandler[] {
	const userService = new UserService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const { id: userID, createdAt } = await userService.create(req.body);
	
			res.status(201).json({
				userID,
				createdAt,
			});
		},
	];
}
