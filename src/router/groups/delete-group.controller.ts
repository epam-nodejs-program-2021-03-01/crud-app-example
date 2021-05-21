import type { RequestHandler } from "express";
import GroupService from "../../services/group.service";

export default function deleteGroup(): RequestHandler[] {
	const groupService = new GroupService();

	return [
		async (req, res) => {
			const groupID = req.params.id;
			const group = await groupService.delete(groupID);
	
			res.json(group);
		},
	];
}
