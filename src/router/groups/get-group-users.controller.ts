import type { RequestHandler } from "express";

export default function getGroupUsers(): RequestHandler[] {
	return [
		(req, res) => {
			const groupID = req.params.id;
	
			res.redirect(301, `/groups/${groupID}?users`);
		},
	];
}
