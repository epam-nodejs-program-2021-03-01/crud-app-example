import express from "express";
import router from "./router";

/** @public */
const app = express();

app.use("/", router);

export default app;
