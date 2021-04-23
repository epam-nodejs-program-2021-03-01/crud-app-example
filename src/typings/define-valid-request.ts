import type { Request } from "express";

/** @private */
type ValidationType = "body" | "query" | "params";

/** @public */
type DefineValidRequest<
	Type extends ValidationType,
	Props extends Record<string, unknown>,
> = Request & {
	[T in Type]: Record<string, unknown> & Props;
};

export default DefineValidRequest;
