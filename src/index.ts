import app from "./app";
import connect from "./db/connect";
import synchronizeModels from "./db/synchronize-models";
import logger from "./log/logger";

const { PORT, DATABASE_CONNECT_TIMEOUT } = process.env;

app.listen(PORT, () => {
	logger.info(`Server is listening on port ${PORT}`);
});

connect({ timeout: DATABASE_CONNECT_TIMEOUT }).then(({ user, database, host, port }) => {
	logger.info(`Connected to database '${database}' at address '${host}:${port}' as user '${user}'`);

	synchronizeModels();
});

process.on("unhandledRejection", (reason) => {
	if (reason instanceof Error)
		throw reason;

	if (typeof reason === "string")
		throw new Error(reason);

	throw new Error(JSON.stringify(reason));
});

process.on("uncaughtException", (error) => {
	logger.error("Uncaught exception encountered:");
	logger.error(error);
	logger.error("Exiting the process with code '1'");
	process.exit(1);
});
