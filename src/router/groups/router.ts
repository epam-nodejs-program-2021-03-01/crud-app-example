import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";
import GroupService from "../../services/group.service";
import handleAsyncErrors from "../handle-async-errors";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501); // TODO: delete

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
	.post(NOT_IMPLEMENTED, handleAsyncErrors("create group", async () => {
		// create new group
	}));

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get group", async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.get(groupID);

		res.json(group);
	}))
	.patch(NOT_IMPLEMENTED, handleAsyncErrors("update group", async () => {
		// update group by ID
	}))
	.delete(handleAsyncErrors("delete group", async (req, res) => {
		const groupID = req.params.id;
		const group = await groupService.delete(groupID);

		res.json(group);
	}));

export default router;
