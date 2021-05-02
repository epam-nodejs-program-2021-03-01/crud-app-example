import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status"; // TODO: remove
import GroupService from "../../services/group.service";
import handleAsyncErrors from "../handle-async-errors";
import validateGroupsIdPatch, { ValidRequest as GroupsIdPatchRequest } from "./validate-groups-id-patch";
import validateGroupsIdUsersPut, { ValidRequest as GroupsIdUsersPutRequest } from "./validate-groups-id-users-put";
import validateGroupsPost, { ValidRequest as GroupsPostRequest } from "./validate-groups-post";

/** @private */
const groupService = new GroupService();

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(async (req, res) => {
		const groups = await groupService.find();

		res.json(groups);
	})
	.post(...validateGroupsPost(), handleAsyncErrors("create group", async (req: GroupsPostRequest, res) => {
		const { id: groupID, createdAt } = await groupService.create(req.body);

		res.status(201).json({
			groupID,
			createdAt,
		});
	}));

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get group", async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.get(groupID, {
			includeUsers: "users" in req.query && req.query.users !== "0" && req.query.users !== "false",
		});

		res.json(group);
	}))
	.patch(...validateGroupsIdPatch(), handleAsyncErrors("update group", async (req: GroupsIdPatchRequest, res) => {
		const groupID = req.params.id;
		const group = await groupService.update(groupID, req.body);

		res.json(group);
	}))
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
	.put(...validateGroupsIdUsersPut(), async (req: GroupsIdUsersPutRequest, res) => {
		const userIDs = req.body.userIDs;
		const groupID = req.params.id;

		await groupService.addUsersToGroup(groupID, userIDs);

		res.redirect(303, `/groups/${groupID}/users`);
	})
	.delete(NOT_IMPLEMENTED, () => {
		// delete users from the group
		// silently return if the users aren't in the group
	});

export default router;
