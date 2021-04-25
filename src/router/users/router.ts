import { Router } from "express";
import allowMethods from "express-allow-methods";
import UsersService from "../../services/users.service";
import handleAsyncErrors from "../handle-async-errors";
import validateUsersGet, { ValidRequest as UsersGetRequest } from "./validate-users-get";
import validateUsersPost, { ValidRequest as UsersPostRequest } from "./validate-users-post";
import validateUsersIdPatch, { ValidRequest as UsersIdPatchRequest } from "./validate-users-id-patch";

/** @private */
const usersService = new UsersService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(...validateUsersGet(), async (req: UsersGetRequest, res) => {
		const users = await usersService.find({
			filter: req.query["login-substring"],
			limit: req.query.limit,
		});

		res.json(users);
	})
	.post(...validateUsersPost(), async (req: UsersPostRequest, res) => {
		const userID = await usersService.create(req.body);

		res.status(201).json({
			userID,
			createdAt: new Date().toJSON(),
		});
	});

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get user", async (req, res) => {
		const userID = req.params.id;
		const user = await usersService.get(userID);
	
		res.json(user);
	}))
	.patch(
		...validateUsersIdPatch(),
		handleAsyncErrors("update user", async (req: UsersIdPatchRequest, res) => {
			const userID = req.params.id;
			const user = await usersService.update(userID, req.body);

			res.json(user);
		},
	))
	.delete(handleAsyncErrors("delete user", async (req, res) => {
		const userID = req.params.id;
		const user = await usersService.delete(userID);

		res.status(202).json(user);
	}));

export default router;
