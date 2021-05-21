import createRouter from "../create-router";
import getUsers from "./get-users.controller";
import createUser from "./create-user.controller";
import getUser from "./get-user.controller";
import updateUser from "./update-user.controller";
import deleteUser from "./delete-user.controller";

export default createRouter({
	"/": {
		get: getUsers(),
		post: createUser(),
	},
	"/:id": {
		get: getUser(),
		patch: updateUser(),
		delete: deleteUser(),
	},
});
