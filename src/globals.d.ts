export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: string;
			readonly PORT: string;
			readonly HEROKU_SLUG_COMMIT: string;
			readonly DATABASE_URL: string;
		}
	}
}
