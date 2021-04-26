import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501); // TODO: delete

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.all(NOT_IMPLEMENTED)
	.get(() => {
		// get all groups
	})
	.post(() => {
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
