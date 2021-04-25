import client, { Sequelize } from "./client";

export default async function connect(): Promise<Sequelize> {
	await client.authenticate();

	return client;
}
