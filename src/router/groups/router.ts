import { Router } from "express";
import allowMethods from "express-allow-methods";
import getGroups from "./get-groups.controller";
import createGroup from "./create-group.controller";
import getGroup from "./get-group.controller";
import updateGroup from "./update-group.controller";
import deleteGroup from "./delete-group.controller";
import getGroupUsers from "./get-group-users.controller";
import addGroupUsers from "./add-group-users.controller";
import removeGroupUsers from "./remove-group-users.controller";

/** @public */
const router = Router();

router.route("/")
	.all(allowMethods("GET", "POST"))
	.get(getGroups())
	.post(createGroup());

router.route("/:id")
	.all(allowMethods("GET", "PATCH", "DELETE"))
	.get(getGroup())
	.patch(updateGroup())
	.delete(deleteGroup());

router.route("/:id/users")
	.all(allowMethods("GET", "PUT", "DELETE"))
	.get(getGroupUsers())
	.put(addGroupUsers())
	.delete(removeGroupUsers());

export default router;
