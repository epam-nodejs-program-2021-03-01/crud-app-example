import createRouter from "../create-router";
import getGroups from "./get-groups.controller";
import createGroup from "./create-group.controller";
import getGroup from "./get-group.controller";
import updateGroup from "./update-group.controller";
import deleteGroup from "./delete-group.controller";
import getGroupUsers from "./get-group-users.controller";
import addGroupUsers from "./add-group-users.controller";
import removeGroupUsers from "./remove-group-users.controller";

export default createRouter({
	"/": {
		get: getGroups(),
		post: createGroup(),
	},
	"/:id": {
		get: getGroup(),
		patch: updateGroup(),
		delete: deleteGroup(),
	},
	"/:id/users": {
		get: getGroupUsers(),
		put: addGroupUsers(),
		delete: removeGroupUsers(),
	},
});
