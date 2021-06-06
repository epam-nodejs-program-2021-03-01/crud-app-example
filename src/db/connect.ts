import type { ClientConfig } from "pg";
import { timeout, TimeoutError } from "promise-timeout";
import client from "./client";

/** @private */
interface ConnectParams {
	timeout?: number | string;
}

/** @private */
interface ConnectionRaw {
	connectionParameters: ClientConfig;
}

export type Connection = Pick<ClientConfig, "user" | "database" | "host" | "port">;

/** @public(get) */
let _connection: Connection | null = null;

export declare const connection: Connection | null;

Object.defineProperty(module.exports, "connection", {
	get: () => _connection,
});

export default async function connect({ timeout: duration }: ConnectParams = {}): Promise<Connection> {
	const timeoutDuration = Number(duration) || null;

	if (timeoutDuration == null)
		await client.authenticate();

	else if (timeoutDuration % 1 || timeoutDuration < 0)
		throw new Error(`Incorrect timeout duration: ${timeoutDuration}`);

	else
		try {
			await timeout(client.authenticate(), timeoutDuration);
		} catch (error) {
			if (error instanceof TimeoutError)
				throw new Error(`Could not connect to DB in ${timeoutDuration} milliseconds`);

			throw error;
		}

	const { connectionParameters: info } = await client.connectionManager.getConnection({ type: "read" }) as ConnectionRaw;
	const { host, port, database, user } = info;

	_connection = { host, port, database, user };

	return _connection;
}
