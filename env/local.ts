import { load } from "dotenv-extended";
import { resolve } from "path";
import { options } from "./common";

load({
	...options,
	path: resolve(__dirname, process.env.NODE_ENV === "test" ? ".env.local-test" : ".env.local"),
	silent: false,
	errorOnMissing: true,
});
