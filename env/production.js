// @ts-check
"use strict";

const { resolve } = require("path");
const { options } = require("./common");

require("dotenv-extended").load({
	...options,
	path: resolve(__dirname, ".env.production"),
});
