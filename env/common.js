// @ts-check
"use strict";

const { resolve } = require("path");

/** @public */
const options = {
	schema: resolve(__dirname, ".env.schema"),
	defaults: resolve(__dirname, ".env.defaults"),
	silent: false,
	errorOnMissing: true
};

module.exports = {
	options,
};
