import express from "express";
import requestID from "express-request-id";
import httpLogger from "./middlewares/http-logger";
import errorHandler from "./middlewares/error-handler";
import authed from "./middlewares/authed";
import router from "./router";

declare global {
	namespace Express {
		interface Request {
			readonly id: string;
		}
	}
}

/** @public */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestID());
app.use(httpLogger());

app.use(authed({
	skipRequests: [
		{ method: "POST", path: "/auth" },
	],
}));

app.use("/", router);

app.use(errorHandler());

export default app;
