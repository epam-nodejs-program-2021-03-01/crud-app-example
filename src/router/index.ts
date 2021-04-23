import { Router } from "express";
import usersRouter from "./users/router";

/** @public */
const router = Router();

router.route("/")
	.get((req, res) => {
		res.json({
			message: "💪",
			healthy: true,
		});
	});

router.use("/users", usersRouter);

export default router;
