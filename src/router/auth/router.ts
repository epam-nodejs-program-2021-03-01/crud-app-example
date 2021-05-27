import { Router } from "express";
import allowMethods from "express-allow-methods";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { issueToken } from "./validation";

/** @public */
const router = Router();

/** @private */
const userService = new UserService();

/** @private */
const authService = new AuthService({ userService });

router.route("/token")
	.all(allowMethods("POST"))
	.post(
		issueToken.requestValidator,
		async (req: typeof issueToken.request, res) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const auth = req.header("authorization")!;
			const credentialsRaw = auth.split(" ")[1];
			const credentials = Buffer.from(credentialsRaw, "base64").toString("ascii");

			const [ login, password ] = credentials.split(":");

			const issue = await authService.issueToken(login, password, {
				data: req.body,
				lifespan: req.query.lifespan,
			});

			res.json(issue);
		},
	);

export default router;
