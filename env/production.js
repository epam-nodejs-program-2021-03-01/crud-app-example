/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const env = require("dotenv-extended");
const path = require("path");
const { options } = require("./common");

env.load({
	...options,
	path: path.resolve(__dirname, ".env.production"),
});
