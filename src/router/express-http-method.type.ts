import type { IRoute } from "express";
import type { HttpMethod } from "express-allow-methods";

/** @public Only those methods from `require("http").METHODS` that are supported by Express */
type ExpressHttpMethod = Lowercase<HttpMethod> & ({
	[Key in keyof IRoute]: IRoute[Key] extends { (): void; } ? Key : never;
})[keyof IRoute];

export default ExpressHttpMethod;
