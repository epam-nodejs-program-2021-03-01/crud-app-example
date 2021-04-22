const { resolve } = require("path");

require("dotenv-extended").load({
	path: resolve(__dirname, ".env.production"),
	errorOnMissing: true,
});
