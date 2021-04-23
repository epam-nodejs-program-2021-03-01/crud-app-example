import express from "express";
import router from "./router";

/** @public */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

export default app;
