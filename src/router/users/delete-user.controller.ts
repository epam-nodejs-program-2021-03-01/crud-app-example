import type { RequestHandler } from "express";
import UserService from "../../services/user.service";

export default function deleteUser(): RequestHandler[] {
	const userService = new UserService();

	return [
		async (req, res) => {
			const userID = req.params.id;
			const user = await userService.delete(userID);
	
			res.status(202).json(user);
		},
	];
}
