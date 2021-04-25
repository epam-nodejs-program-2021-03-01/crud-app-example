import { load } from "dotenv-extended";
import { resolve } from "path";
import { options } from "./common";

load({
	...options,
	path: resolve(__dirname, ".env.development"),
	silent: false,
});
