import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import UserService from "../../services/user.service";
import { naturalNumber } from "../definitions";
import RequestValidation, { Joi } from "../request-validation";

/** @private */
interface GetUsersQuery {
	"login-substring"?: string;
	limit?: number;
}

/** @private */
const userLoginSubstring = Joi.string()
	.max(32);

/** @private */
const { requestValidator, request } = new RequestValidation<unknown, GetUsersQuery>({
	[Segments.QUERY]: Joi.object<GetUsersQuery>({
		"login-substring": userLoginSubstring.allow(""),
		limit: naturalNumber.allow(""),
	}),
});

export default function getUsers(): RequestHandler[] {
	const userService = new UserService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const users = await userService.find({
				filter: req.query["login-substring"],
				limit: req.query.limit,
			});
	
			res.json(users);
		},
	];
}
