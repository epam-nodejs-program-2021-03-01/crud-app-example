import { Router } from "express";
import { connection } from "../db/connect";
import auth from "./auth.middleware";
import authRouter from "./auth/router";
import groupsRouter from "./groups/router";
import usersRouter from "./users/router";

/** @public */
const router = Router();

router.route("/")
	.get((req, res) => {
		const conditions = [
			true, // app is running
			connection != null,
		];

		const conditionsTotal = conditions.length;
		const conditionsMet = conditions.filter(Boolean).length;
		const healthFactor = conditionsMet / conditionsTotal;

		res.json({
			message: healthFactor === 1 ? "💪" : "👋",
			healthy: healthFactor >= 0.5,
			checks: {
				conditionsTotal,
				conditionsMet,
				healthFactor,
			},
			version: process.env.HEROKU_SLUG_COMMIT,
			db: { connection },
		});
	});

router.use("/auth", authRouter);
router.use("/groups", auth(), groupsRouter);
router.use("/users", auth(), usersRouter);

export default router;
