import RequestValidation, { Joi, Segments } from "../request-validation";

/** @private */
interface IssueTokenQuery {
	lifespan?: string;
}

/** @private */
const authorizationHeader = Joi.string()
	.pattern(/^Basic [A-Za-z0-9/\\_+-]+=*$/, { name: "basic authentication credentials" });

export const issueToken = new RequestValidation<object | undefined, IssueTokenQuery>({
	[Segments.QUERY]: Joi.object<IssueTokenQuery>({
		lifespan: Joi.string().optional(),
	}),
	[Segments.HEADERS]: Joi.object({
		authorization: authorizationHeader.required(),
	}),
	[Segments.BODY]: Joi.object().optional(),
});
