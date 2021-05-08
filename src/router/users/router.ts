import { Router } from "express";
import allowMethods from "express-allow-methods";
import UserService from "../../services/user.service";
import { getUsers, createUser, updateUser } from "./validation";

/** @private */
const userService = new UserService();

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(
		getUsers.requestValidator,
		async (req: typeof getUsers.request, res) => {
			const users = await userService.find({
				filter: req.query["login-substring"],
				limit: req.query.limit,
			});
	
			res.json(users);
		},
	)
	.post(
		createUser.requestValidator,
		async (req: typeof createUser.request, res) => {
			const { id: userID, createdAt } = await userService.create(req.body);
	
			res.status(201).json({
				userID,
				createdAt,
			});
		},
	);

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(async (req, res) => {
		const userID = req.params.id;
		const user = await userService.get(userID);
	
		res.json(user);
	})
	.patch(
		updateUser.requestValidator,
		async (req: typeof updateUser.request, res) => {
			const userID = req.params.id;
			const user = await userService.update(userID, req.body);

			res.json(user);
		},
	)
	.delete(async (req, res) => {
		const userID = req.params.id;
		const user = await userService.delete(userID);

		res.status(202).json(user);
	});

export default router;
