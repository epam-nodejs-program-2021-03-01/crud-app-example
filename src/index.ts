import app from "./app";
import connect from "./db/connect";

const { PORT, CONNECT_TIMEOUT = 10_000 } = process.env;

connect({ timeout: +CONNECT_TIMEOUT }).then(() => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
});
