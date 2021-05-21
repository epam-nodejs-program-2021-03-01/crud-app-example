import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import GroupService from "../../services/group.service";
import queryHasFlag from "../query-has-flag";
import RequestValidation, { Joi } from "../request-validation";
import { includeUsersFlag } from "./definitions";

/** @private */
interface GetGroupQuery {
	users?: "false" | 0 | "0" | unknown;
}

/** @private */
const { requestValidator, request } = new RequestValidation<unknown, GetGroupQuery>({
	[Segments.QUERY]: Joi.object<GetGroupQuery>({
		users: includeUsersFlag,
	}),
});

export default function getGroup(): RequestHandler[] {
	const groupService = new GroupService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const groupID = req.params.id;
			const group = await groupService.get(groupID, {
				includeUsers: queryHasFlag(req.query, "users"),
			});

			res.json(group);
		},
	];
}
