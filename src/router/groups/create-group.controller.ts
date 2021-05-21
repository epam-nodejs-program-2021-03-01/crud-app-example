import { Segments } from "celebrate";
import type { RequestHandler } from "express";
import type { GroupTypeCreation } from "../../db/models/group";
import GroupService from "../../services/group.service";
import RequestValidation, { Joi } from "../request-validation";
import { groupName, groupPermissions } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation<GroupTypeCreation>({
	[Segments.BODY]: Joi.object<GroupTypeCreation>({
		name: groupName.required(),
		permissions: groupPermissions.required(),
	}),
});

export default function createGroup(): RequestHandler[] {
	const groupService = new GroupService();

	return [
		requestValidator,
		async (req: typeof request, res) => {
			const { id: groupID, createdAt } = await groupService.create(req.body);

			res.status(201).json({
				groupID,
				createdAt,
			});
		},
	];
}
