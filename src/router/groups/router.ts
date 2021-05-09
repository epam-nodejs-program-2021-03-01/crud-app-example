import { Router } from "express";
import allowMethods from "express-allow-methods";
import GroupService from "../../services/group.service";
import queryHasFlag from "../query-has-flag";
import { getGroup, createGroup, updateGroup, addUsers, removeUsers } from "./validation";

/** @private */
const groupService = new GroupService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(async (req, res) => {
		const groups = await groupService.find();

		res.json(groups);
	})
	.post(
		createGroup.requestValidator,
		async (req: typeof createGroup.request, res) => {
			const { id: groupID, createdAt } = await groupService.create(req.body);

			res.status(201).json({
				groupID,
				createdAt,
			});
		},
	);

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(
		getGroup.requestValidator,
		async (req: typeof getGroup.request, res) => {
			const groupID = req.params.id;
			const group = await groupService.get(groupID, {
				includeUsers: queryHasFlag(req.query, "users"),
			});

			res.json(group);
		},
	)
	.patch(
		updateGroup.requestValidator,
		async (req: typeof updateGroup.request, res) => {
			const groupID = req.params.id;
			const group = await groupService.update(groupID, req.body);

			res.json(group);
		},
	)
	.delete(async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.delete(groupID);

		res.json(group);
	});

router.route("/:id/users")
	.all(allowMethods("GET", "PUT", "DELETE"))
	.get((req, res) => {
		const groupID = req.params.id;

		res.redirect(301, `/groups/${groupID}?users`);
	})
	.put(
		addUsers.requestValidator,
		async (req: typeof addUsers.request, res) => {
			const userIDs = req.body.userIDs;
			const groupID = req.params.id;

			await groupService.addUsersToGroup(groupID, userIDs);

			res.redirect(303, `/groups/${groupID}/users`);
		},
	)
	.delete(
		removeUsers.requestValidator,
		async (req: typeof removeUsers.request, res) => {
			const userIDs = req.body.userIDs;
			const groupID = req.params.id;

			await groupService.removeUsersFromGroup(groupID, userIDs);

			res.redirect(303, `/groups/${groupID}/users`);
		},
	);

export default router;
