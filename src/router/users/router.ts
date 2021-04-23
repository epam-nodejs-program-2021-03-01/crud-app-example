import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";
import UsersService from "../../services/users.service";
import handleAsyncErrors from "../handle-async-errors";
import validateQuery, { ValidRequest } from "./validate-query-root-path-get";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @private */
const usersService = new UsersService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(validateQuery(), async (req: ValidRequest, res) => {
		const users = await usersService.getUsers({
			filter: req.query["login-substring"],
			limit: req.query.limit,
		});

		res.json(users);
	})
	.post(NOT_IMPLEMENTED, () => {
		// TODO: create new user
	});

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get user", async (req, res) => {
		const userID = req.params.id;
		const user = await usersService.getUser(userID);
	
		res.json(user);
	}))
	.patch(NOT_IMPLEMENTED, () => {
		// TODO: update user
	})
	.delete(handleAsyncErrors("delete user", async (req, res) => {
		const userID = req.params.id;
		const user = await usersService.deleteUser(userID);

		res.status(202).json(user);
	}));

export default router;
