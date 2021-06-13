import type { RequestHandler } from "express";
import RequestValidation, { Segments, Joi } from "../request-validation";
import { groupID } from "./definitions";

/** @private */
const { requestValidator, request } = new RequestValidation({
	[Segments.PARAMS]: Joi.object({
		id: groupID,
	}),
});

export default function getGroupUsers(): RequestHandler[] {
	return [
		requestValidator,
		(req: typeof request, res) => {
			const groupID = req.params.id;
	
			res.redirect(301, `/groups/${groupID}?users`);
		},
	];
}
