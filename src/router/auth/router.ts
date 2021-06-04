import { Router } from "express";
import allowMethods from "express-allow-methods";
import login from "./login.controller";
import renew from "./renew.controller";
import logout from "./logout.controller";

/** @public */
const router = Router();

router.route("/login")
	.all(allowMethods("POST"))
	.post(login());

router.route("/renew")
	.all(allowMethods("POST"))
	.post(renew());

router.route("/logout")
	.all(allowMethods("POST"))
	.post(logout());

export default router;
