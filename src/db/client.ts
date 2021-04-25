import type { ClientConfig } from "pg";
import { Sequelize } from "sequelize";

export * from "sequelize";

/** @public */
const client = new Sequelize(process.env.DATABASE_URL, {
	dialect: "postgres",
	dialectOptions: <ClientConfig> {
		ssl: {
			require: true,
			rejectUnauthorized: false, // allow self-signed certificates
		},
	},
});

export default client;
