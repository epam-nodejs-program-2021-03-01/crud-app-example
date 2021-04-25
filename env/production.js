// Production environment variables are set up via Heroku application settings
//   https://dashboard.heroku.com/apps/shrouded-bayou-97400/settings

"use strict";

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const env = require("dotenv-extended");

env.load({
	schema: path.resolve(__dirname, ".env.schema"),
	defaults: path.resolve(__dirname, ".env.defaults"),
	errorOnMissing: true,
});
