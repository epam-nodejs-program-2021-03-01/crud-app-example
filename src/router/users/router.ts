import { Router } from "express";
import allowMethods from "express-allow-methods";
import sendStatus from "../../middlewares/send-status";
import UsersService from "../../services/users.service";
import handleAsyncErrors from "../handle-async-errors";
import validateRootPathGet, { ValidRequest as ValidRootPathGetRequest } from "./validate-root-path-get";
import validateRootPathPost, { ValidRequest as ValidRootPathPostRequest } from "./validate-root-path-post";

/** @private */
const NOT_IMPLEMENTED = sendStatus(501);

/** @private */
const usersService = new UsersService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(...validateRootPathGet(), async (req: ValidRootPathGetRequest, res) => {
		const users = await usersService.getUsers({
			filter: req.query["login-substring"],
			limit: req.query.limit,
		});

		res.json(users);
	})
	.post(...validateRootPathPost(), async (req: ValidRootPathPostRequest, res) => {
		const userID = await usersService.createUser(req.body);

		res.status(201).json({
			userID,
			createdAt: Date.now(),
		});
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
