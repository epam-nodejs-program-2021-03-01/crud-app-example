import express from "express";
import httpLogger from "./middlewares/http-logger";
import router from "./router";

/** @public */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(httpLogger());

app.use("/", router);

export default app;
