import type { Request } from "express";

/** @private */
type ValidationType = "body" | "query" | "params";

/** @public */
type DefineValidRequest<
	Type extends ValidationType,
	// eslint-disable-next-line @typescript-eslint/ban-types
	Props extends object,
> = Request & {
	[T in Type]: Record<string, unknown> & Props;
};

export default DefineValidRequest;
