import { Router } from "express";
import allowMethods from "express-allow-methods";
import AuthService from "../../services/auth.service";

/** @public */
const router = Router();

/** @private */
const authService = new AuthService();

router.route("/token")
	.all(allowMethods("POST"))
	.post((req, res) => {
		const issue = authService.issueToken({
			data: req.body,
			lifespan: req.query.lifespan as string,
		});

		res.json(issue);
	});

export default router;
