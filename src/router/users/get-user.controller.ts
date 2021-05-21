import type { RequestHandler } from "express";
import UserService from "../../services/user.service";

export default function getUser(): RequestHandler[] {
	const userService = new UserService();

	return [
		async (req, res) => {
			const userID = req.params.id;
			const user = await userService.get(userID);
		
			res.json(user);
		},
	];
}
