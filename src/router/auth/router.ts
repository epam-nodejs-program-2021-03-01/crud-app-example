import { Router } from "express";
import allowMethods from "express-allow-methods";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { login } from "./validation";

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
			const issue = await authService.issueToken(auth, {
				data: req.body,
			});

			res.json(issue);
		},
	);

export default router;
