import winston from "winston";
import { consoleFormat } from "winston-console-format";
import path from "path";

/** @private */
const logsDir = path.resolve(process.cwd(), process.env.LOGGER_LOGS_DIR);

/** @private */
const outputFile = path.resolve(logsDir, process.env.LOGGER_OUTPUT_LOG_FILENAME);

/** @private */
const errorFile = path.resolve(logsDir, process.env.LOGGER_ERROR_LOG_FILENAME);

/** @private */
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
} as const;

export type Level = keyof typeof levels;

/** @private */
function isError(level: Level): boolean {
	return levels[level] <= 1;
}

/** @public */
const logger = winston.createLogger({
	level: process.env.LOGGER_LEVEL,
	levels,
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.ms(),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.padLevels(),
				consoleFormat({
					showMeta: true,
					metaStrip: [ "timestamp" ],
					inspectOptions: {
						depth: 5,
						colors: true,
					},
				}),
			),
		}),
	],
});

for (const level of Object.keys(levels) as Level[])
	logger.add(new winston.transports.File({
		level,
		filename: isError(level) ? errorFile : outputFile,
	}));

export default logger;
