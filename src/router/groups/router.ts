import { Router } from "express";
import allowMethods from "express-allow-methods";
import GroupService from "../../services/group.service";
import handleAsyncErrors from "../handle-async-errors";
import { validators, requests } from "./validation";

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
		validators.forCreateGroup,
		handleAsyncErrors("create group", async (req: requests.CreateGroup, res) => {
			const { id: groupID, createdAt } = await groupService.create(req.body);

			res.status(201).json({
				groupID,
				createdAt,
			});
		}),
	);

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get group", async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.get(groupID, {
			includeUsers: "users" in req.query && req.query.users !== "0" && req.query.users !== "false",
		});

		res.json(group);
	}))
	.patch(
		validators.forUpdateGroup,
		handleAsyncErrors("update group", async (req: requests.UpdateGroup, res) => {
			const groupID = req.params.id;
			const group = await groupService.update(groupID, req.body);

			res.json(group);
		}),
	)
	.delete(handleAsyncErrors("delete group", async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.delete(groupID);

		res.json(group);
	}));

router.route("/:id/users")
	.all(allowMethods("GET", "PUT", "DELETE"))
	.get((req, res) => {
		const groupID = req.params.id;

		res.redirect(301, `/groups/${groupID}?users`);
	})
	.put(
		validators.forAddUsers,
		handleAsyncErrors("add users to the group", async (req: requests.AddUsers, res) => {
			const userIDs = req.body.userIDs;
			const groupID = req.params.id;

			await groupService.addUsersToGroup(groupID, userIDs);

			res.redirect(303, `/groups/${groupID}/users`);
		}),
	)
	.delete(
		validators.forRemoveUsers,
		handleAsyncErrors("remove users from the group", async (req: requests.RemoveUsers, res) => {
			const userIDs = req.body.userIDs;
			const groupID = req.params.id;

			await groupService.removeUsersFromGroup(groupID, userIDs);

			res.redirect(303, `/groups/${groupID}/users`);
		}),
	);

export default router;
