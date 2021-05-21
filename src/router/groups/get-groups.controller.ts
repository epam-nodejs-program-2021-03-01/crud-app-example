import type { RequestHandler } from "express";
import GroupService from "../../services/group.service";

export default function getGroups(): RequestHandler[] {
	const groupService = new GroupService();

	return [
		async (req, res) => {
			const groups = await groupService.find();
	
			res.json(groups);
		},
	];
}
