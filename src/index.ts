import app from "./app";
import connect from "./db/connect";

const { PORT } = process.env;

connect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});
});
