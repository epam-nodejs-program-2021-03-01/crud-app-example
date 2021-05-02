import type { Request } from "express";

/** @public */
type DefineValidRequest<
	Body extends unknown = unknown,
	Query extends object = {},
> = Request<Record<string, string>, unknown, Body, Query>;

export default DefineValidRequest;
