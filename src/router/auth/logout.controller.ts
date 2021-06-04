import type { RequestHandler } from "express";
import AuthService from "../../services/auth.service";

export default function logout(): RequestHandler[] {
	const authService = new AuthService();

	return [
		async (req, res) => {
			const auth = req.header("authorization");

			await authService.logout(auth);

			res.sendStatus(204);
		},
	];
}
