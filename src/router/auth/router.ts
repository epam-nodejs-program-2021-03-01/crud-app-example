import { Router } from "express";
import allowMethods from "express-allow-methods";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { login, renew } from "./validation";

/** @public */
const router = Router();

/** @private */
const userService = new UserService();

/** @private */
const authService = new AuthService({ userService });

router.route("/login")
	.all(allowMethods("POST"))
	.post(
		login.requestValidator,
		async (req: typeof login.request, res) => {
			const auth = req.header("authorization");
			const tokens = await authService.login(auth, req.body);

			res.json(tokens);
		},
	);

router.route("/renew")
	.all(allowMethods("POST"))
	.post(
		renew.requestValidator,
		async (req: typeof renew.request, res) => {
			const auth = req.header("authorization");
			const tokens = await authService.renew(auth, req.body);

			res.json(tokens);
		},
	);

export default router;
