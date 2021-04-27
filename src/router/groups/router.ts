import { Router } from "express";
import allowMethods from "express-allow-methods";
import GroupService from "../../services/group.service";
import handleAsyncErrors from "../handle-async-errors";
import validateGroupsIdPatch, { ValidRequest as GroupsIdPatchRequest } from "./validate-groups-id-patch";
import validateGroupsPost, { ValidRequest as GroupsPostRequest } from "./validate-groups-post";

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
		const group = await groupService.get(groupID);

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

export default router;
