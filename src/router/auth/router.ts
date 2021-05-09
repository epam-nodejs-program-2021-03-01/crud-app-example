import { Router } from "express";
import allowMethods from "express-allow-methods";
import AuthService from "../../services/auth.service";

/** @public */
const router = Router();

/** @private */
const authService = new AuthService();

router.route("/")
	.all(allowMethods("GET"))
	.get((req, res) => {
		const issue = authService.issueToken();

		res.json(issue);
	});

export default router;
