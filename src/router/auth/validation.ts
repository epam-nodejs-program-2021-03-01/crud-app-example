import RequestValidation, { Joi, Segments } from "../request-validation";

export const login = new RequestValidation<object | undefined>({
	[Segments.BODY]: Joi.object().optional(),
});

export const renew = new RequestValidation<object | undefined>({
	[Segments.BODY]: Joi.object().optional(),
});
