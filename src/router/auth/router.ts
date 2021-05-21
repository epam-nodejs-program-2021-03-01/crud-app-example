import createRouter from "../create-router";
import login from "./login.controller";
import renew from "./renew.controller";
import logout from "./logout.controller";

export default createRouter({
	"/login": {
		post: login(),
	},
	"/renew": {
		post: renew(),
	},
	"/logout": {
		post: logout(),
	},
});
