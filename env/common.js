/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");

/** @public */
const options = {
	schema: path.resolve(__dirname, ".env.schema"),
	defaults: path.resolve(__dirname, ".env.defaults"),
	silent: false,
	errorOnMissing: true
};

module.exports = {
	options,
};
