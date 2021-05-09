import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET"))
	.all(NOT_IMPLEMENTED)
	.get(() => {
		// get new jwt token
	});

export default router;
