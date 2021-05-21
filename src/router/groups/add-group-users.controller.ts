import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import Joi from "joi";
import GroupService from "../../services/group.service";
import RequestValidation from "../request-validation";
import type WithUserIDs from "./with-user-ids.type";
import { userIDs } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation<WithUserIDs>({
	[Segments.BODY]: Joi.object<WithUserIDs>({
		userIDs: userIDs.required(),
	}),
});

export default function addGroupUsers(): RequestHandler[] {
	const groupService = new GroupService();

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
