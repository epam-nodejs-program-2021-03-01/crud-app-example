import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.all(NOT_IMPLEMENTED) // FIXME: remove
	.get(() => {
		// TODO: get all users
	})
	.post(() => {
		// TODO: create new user
	});

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.all(NOT_IMPLEMENTED) // FIXME: remove
	.get(() => {
		// TODO: get user
	})
	.patch(() => {
		// TODO: update user
	})
	.delete(() => {
		// TODO: delete user
	});

export default router;
