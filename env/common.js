"use strict";

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @public @type {import("dotenv-extended").IDotenvExtendedOptions} */
const options = {
	schema: path.resolve(__dirname, ".env.schema"),
	defaults: path.resolve(__dirname, ".env.defaults"),
	errorOnMissing: true,
};

module.exports = {
	options,
};

process.on('unhandledRejection', (/** @type {unknown} */ reason) => {
	if (reason instanceof Error)
		throw reason;

	if (typeof reason === "string")
		throw new Error(reason);

	throw new Error(JSON.stringify(reason));
});
