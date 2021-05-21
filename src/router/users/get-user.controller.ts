import type { RequestHandler } from "express";
import type UserService from "../../services/user.service";

/** @private */
interface Deps {
	userService: UserService;
}

export default function getUser({ userService }: Deps): RequestHandler[] {
	return [
		async (req, res) => {
			const userID = req.params.id;
			const user = await userService.get(userID);
		
			res.json(user);
		},
	];
}
