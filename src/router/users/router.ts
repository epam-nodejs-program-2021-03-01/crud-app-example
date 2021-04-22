import { Router } from "express";

/** @public */
const router = Router();

router.use((req, res) => {
	res.sendStatus(501); // TODO: remove
});

export default router;
