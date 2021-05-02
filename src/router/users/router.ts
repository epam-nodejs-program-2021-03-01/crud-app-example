import { Router } from "express";
import allowMethods from "express-allow-methods";
import UserService from "../../services/user.service";
import handleAsyncErrors from "../handle-async-errors";
import { validators, requests } from "./validation";

/** @private */
const userService = new UserService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(
		validators.forGetUsers,
		async (req: requests.GetUsers, res) => {
			const users = await userService.find({
				filter: req.query["login-substring"],
				limit: req.query.limit,
			});
	
			res.json(users);
		},
	)
	.post(
		validators.forCreateUser,
		async (req: requests.CreateUser, res) => {
			const { id: userID, createdAt } = await userService.create(req.body);
	
			res.status(201).json({
				userID,
				createdAt,
			});
		},
	);

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(handleAsyncErrors("get user", async (req, res) => {
		const userID = req.params.id;
		const user = await userService.get(userID);
	
		res.json(user);
	}))
	.patch(
		validators.forUpdateUser,
		handleAsyncErrors("update user", async (req: requests.UpdateUser, res) => {
			const userID = req.params.id;
			const user = await userService.update(userID, req.body);

			res.json(user);
		},
	))
	.delete(handleAsyncErrors("delete user", async (req, res) => {
		const userID = req.params.id;
		const user = await userService.delete(userID);

		res.status(202).json(user);
	}));

export default router;
