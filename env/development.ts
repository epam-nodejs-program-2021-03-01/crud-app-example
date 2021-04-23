import { load } from "dotenv-extended";
import { resolve } from "path";

load({
	path: resolve(__dirname, ".env.development"),
	schema: resolve(__dirname, ".env.schema"),
	defaults: resolve(__dirname, ".env.defaults"),
	silent: false,
	errorOnMissing: true,
});
