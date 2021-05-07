import app from "./app";
import connect from "./db/connect";

const { PORT, DATABASE_CONNECT_TIMEOUT } = process.env;

connect({ timeout: DATABASE_CONNECT_TIMEOUT }).then(() => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
});
