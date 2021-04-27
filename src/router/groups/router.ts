import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";
import GroupService from "../../services/group.service";

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
	.post(NOT_IMPLEMENTED, () => {
		// create new group
	});

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.all(NOT_IMPLEMENTED)
	.get(() => {
		// get group by ID
	})
	.patch(() => {
		// update group by ID
	})
	.delete(() => {
		// delete group by ID
	});

export default router;
