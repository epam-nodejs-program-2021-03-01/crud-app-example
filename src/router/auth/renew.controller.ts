import type { RequestHandler } from "express";
import AuthService from "../../services/auth.service";
import RequestValidation, { Joi, Segments } from "../request-validation";

/** @private */
const { requestValidator, request } = new RequestValidation<object | undefined>({
	[Segments.BODY]: Joi.object().optional(),
});

export default function renew(): RequestHandler[] {
	const authService = new AuthService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const auth = req.header("authorization");
			const tokens = await authService.renew(auth, req.body);

			res.json(tokens);
		},
	];
}
