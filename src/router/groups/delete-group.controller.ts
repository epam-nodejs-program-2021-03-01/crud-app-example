import type { RequestHandler } from "express";
import type GroupService from "../../services/group.service";

/** @private */
interface Deps {
	groupService: GroupService;
}

export default function deleteGroup({ groupService }: Deps): RequestHandler[] {
	return [
		async (req, res) => {
			const groupID = req.params.id;
			const group = await groupService.delete(groupID);
	
			res.json(group);
		},
	];
}
