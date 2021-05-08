import type { Level } from "./log/logger";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: string;
			readonly PORT: string;
			readonly HEROKU_SLUG_COMMIT: string;
			readonly DATABASE_URL: string;
			readonly DATABASE_CONNECT_TIMEOUT: string;
			readonly LOGGER_LEVEL: Level;
			readonly LOGGER_LOGS_DIR: string;
			readonly LOGGER_OUTPUT_LOG_FILENAME: string;
			readonly LOGGER_ERROR_LOG_FILENAME: string;
		}
	}
}
