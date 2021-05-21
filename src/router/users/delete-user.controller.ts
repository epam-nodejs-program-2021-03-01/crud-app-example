import type { RequestHandler } from "express";
import type UserService from "../../services/user.service";

/** @private */
interface Deps {
	userService: UserService;
}

export default function deleteUser({ userService }: Deps): RequestHandler[] {
	return [
		async (req, res) => {
			const userID = req.params.id;
			const user = await userService.delete(userID);
	
			res.status(202).json(user);
		},
	];
}
