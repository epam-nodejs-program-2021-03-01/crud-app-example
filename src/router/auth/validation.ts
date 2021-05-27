import RequestValidation, { Joi, Segments } from "../request-validation";

export const issueToken = new RequestValidation<object | undefined>({
	[Segments.BODY]: Joi.object().optional(),
});
