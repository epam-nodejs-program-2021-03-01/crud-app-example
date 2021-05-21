import type { Request, RequestHandler } from "express";
import { celebrator, SchemaOptions } from "celebrate";

export * from "celebrate";

/** @private */
const createValidator = celebrator({
	reqContext: true,
}, {
	abortEarly: false,
	allowUnknown: true,
});

export default class RequestValidation<
	Body extends unknown = unknown,
	Query extends object = {},
> {
	request = null as unknown as Request<Record<string, string>, unknown, Body, Query>;
	requestValidator: RequestHandler;

	constructor(schema: SchemaOptions) {
		this.requestValidator = createValidator(schema);
	}
}
