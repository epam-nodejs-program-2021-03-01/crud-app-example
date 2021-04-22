import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";
import UsersService, { UserNotFoundError } from "../../services/users.service";

/** @private */
const naturalNumber = /^\d+$/;

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @private */
const usersService = new UsersService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	// GET /users?login-substring=[…]&limit=[…]
	.get(async (req, res) => {
		const query = req.query as Record<string, string | undefined>; // don't try to understand it, – feel it
		const filter = query["login-substring"];

		let limit: number | undefined;

		if (query.limit?.match(naturalNumber))
			limit = parseInt(query.limit, 10);

		const users = await usersService.getUsers({ filter, limit });

		res.json(users);
	})
	.post(NOT_IMPLEMENTED, () => {
		// TODO: create new user
	});

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(async (req, res, next) => {
		const userID = req.params.id;

		try {
			const user = await usersService.getUser(userID);

			res.json(user);
		} catch (error: unknown) {
			if (error instanceof UserNotFoundError)
				return res.status(404).json({
					error: "Could not get user",
					reason: error.message,
				});

			// delegate unknown error to error handler
			next(error);
		}
	})
	.patch(NOT_IMPLEMENTED, () => {
		// TODO: update user
	})
	.delete(async (req, res, next) => {
		const userID = req.params.id;

		try {
			const user = await usersService.deleteUser(userID);

			res.status(202).json(user);
		} catch (error: unknown) {
			if (error instanceof UserNotFoundError)
				return res.status(404).json({
					error: "Could not delete user",
					reason: error.message,
				});

			// delegate unknown error to error handler
			next(error);
		}
	});

export default router;
