import type { ClientConfig } from "pg";
import { timeout, TimeoutError } from "promise-timeout";
import client from "./client";

export type ConnectionParameters = Pick<ClientConfig, "user" | "database" | "host" | "port">;

/** @private */
interface Connection {
	connectionParameters: ConnectionParameters;
}

/** @private */
interface ConnectParams {
	timeout?: number | string;
}

export default async function connect({ timeout: duration }: ConnectParams = {}): Promise<ConnectionParameters> {
	duration = Number(duration);

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

	const { connectionParameters } = await client.connectionManager.getConnection({ type: "read" }) as Connection;

	return connectionParameters;
}
