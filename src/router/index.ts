import { Router } from "express";
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

router.use("/users", usersRouter);

export default router;
