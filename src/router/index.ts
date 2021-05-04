import { Router } from "express";
import errorHandler from "./error-handler";
import groupsRouter from "./groups/router";
import usersRouter from "./users/router";

/** @public */
const router = Router();

router.route("/")
	.get((req, res) => {
		res.json({
			message: "💪",
			healthy: true,
			version: process.env.HEROKU_SLUG_COMMIT,
		});
	});

router.use("/groups", groupsRouter);
router.use("/users", usersRouter);

router.use(errorHandler());

export default router;
