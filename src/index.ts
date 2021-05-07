import app from "./app";
import connect from "./db/connect";
import synchronizeModels from "./db/synchronize-models";

const { PORT, DATABASE_CONNECT_TIMEOUT } = process.env;

connect({ timeout: DATABASE_CONNECT_TIMEOUT }).then(({ user, database, host, port }) => {
	console.log(`Connected to database '${database}' at address '${host}:${port}' as user '${user}'`);

	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});

	synchronizeModels();
});
