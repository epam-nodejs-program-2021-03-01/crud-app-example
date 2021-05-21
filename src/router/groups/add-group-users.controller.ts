import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type GroupService from "../../services/group.service";
import RequestValidation, { Joi } from "../request-validation";
import type WithUserIDs from "./with-user-ids.type";
import { userIDs } from "./definitions";

/** @private */
interface Deps {
	groupService: GroupService;
}

/** @private */
const { requestValidator, request } = new RequestValidation<WithUserIDs>({
	[Segments.BODY]: Joi.object<WithUserIDs>({
		userIDs: userIDs.required(),
	}),
});

export default function addGroupUsers({ groupService }: Deps): RequestHandler[] {
	return [
		requestValidator,
		async (req: typeof request, res) => {
			const userIDs = req.body.userIDs;
			const groupID = req.params.id;

			await groupService.addUsersToGroup(groupID, userIDs);

			res.redirect(303, `/groups/${groupID}/users`);
		},
	];
}
