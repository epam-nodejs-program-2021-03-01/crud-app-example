import { celebrator } from "celebrate";

export * from "celebrate";

/** @public */
const createValidator = celebrator({
	reqContext: true,
}, {
	abortEarly: false,
	allowUnknown: true,
});

export default createValidator;
