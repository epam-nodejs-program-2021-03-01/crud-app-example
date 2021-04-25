// Production environment variables are set up via Heroku application settings
//   https://dashboard.heroku.com/apps/shrouded-bayou-97400/settings

"use strict";

/* eslint-disable @typescript-eslint/no-var-requires */
const env = require("dotenv-extended");
const path = require("path");
const { options } = require("./common");

env.load({
	...options,
	path: path.resolve(__dirname, ".env.production"),
});
