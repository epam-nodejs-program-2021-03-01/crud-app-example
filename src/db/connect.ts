import { timeout, TimeoutError } from "promise-timeout";
import client, { Sequelize } from "./client";

/** @private */
interface ConnectParams {
	timeout?: number;
}

export default async function connect({ timeout: duration }: ConnectParams = {}): Promise<Sequelize> {
	if (duration == null)
		await client.authenticate();

	else if (duration % 1 || duration < 0)
		throw new Error(`Incorrect timeout duration: ${duration}`);

	else
		try {
			await timeout(client.authenticate(), duration);
		} catch (error) {
			if (error instanceof TimeoutError)
				throw new Error(`Could not connect to DB in ${duration} milliseconds`);

			throw error;
		}

	return client;
}
