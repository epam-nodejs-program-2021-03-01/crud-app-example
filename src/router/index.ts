import { Router } from "express";
import auth from "./auth.middleware";
import authRouter from "./auth/router";
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

router.use("/auth", authRouter);
router.use("/groups", auth(), groupsRouter);
router.use("/users", auth(), usersRouter);

export default router;
