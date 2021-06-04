import type { RequestHandler } from "express";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import RequestValidation, { Joi, Segments } from "../request-validation";

/** @private */
const { requestValidator, request } = new RequestValidation<object | undefined>({
	[Segments.BODY]: Joi.object().optional(),
});

export default function login(): RequestHandler[] {
	const userService = new UserService();
	const authService = new AuthService({ userService });

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const auth = req.header("authorization");
			const tokens = await authService.login(auth, req.body);

			res.json(tokens);
		},
	];
}
