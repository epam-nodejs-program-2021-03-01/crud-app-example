import { Router } from "express";
import allowMethods from "express-allow-methods";
import getUsers from "./get-users.controller";
import createUser from "./create-user.controller";
import getUser from "./get-user.controller";
import updateUser from "./update-user.controller";
import deleteUser from "./delete-user.controller";

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(getUsers())
	.post(createUser());

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(getUser())
	.patch(updateUser())
	.delete(deleteUser());

export default router;
