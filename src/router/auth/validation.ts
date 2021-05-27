import RequestValidation, { Joi, Segments } from "../request-validation";

/** @private */
interface IssueTokenQuery {
	lifespan?: string;
}

export const issueToken = new RequestValidation<object | undefined, IssueTokenQuery>({
	[Segments.QUERY]: Joi.object<IssueTokenQuery>({
		lifespan: Joi.string().optional(),
	}),
	[Segments.BODY]: Joi.object().optional(),
});
