import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type { GroupTypeCreation } from "../../db/models/group";
import GroupService from "../../services/group.service";
import RequestValidation, { Joi } from "../request-validation";
import { groupName, groupPermissions } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation<Partial<GroupTypeCreation>>({
	[Segments.BODY]: Joi.object<GroupTypeCreation>({
		name: groupName,
		permissions: groupPermissions,
	}),
});

export default function updateGroup(): RequestHandler[] {
	const groupService = new GroupService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const groupID = req.params.id;
			const group = await groupService.update(groupID, req.body);

			res.json(group);
		}
	];
}
