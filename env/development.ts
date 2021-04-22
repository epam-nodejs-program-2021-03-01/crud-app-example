import { resolve } from "path";
import { load } from "dotenv-extended";

load({
	path: resolve(__dirname, ".env.development"),
	errorOnMissing: true,
});
