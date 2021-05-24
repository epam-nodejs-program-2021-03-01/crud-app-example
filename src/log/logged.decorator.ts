import logger, { Level } from "./logger";
import stringifyFunctionCall, { KnownArgMapperName, ArgMapper } from "./stringify-function-call";

declare global {
	interface Function {
		(...args: unknown[]): unknown;
	}
}

/** @private */
interface Constructor<Instance extends object> extends NewableFunction {
	new (...args: unknown[]): Instance;
}

/** @private */
interface LoggedParams {
	level?: Level;
	mapArgs?: KnownArgMapperName | ArgMapper;
}

/** @private */
const STATIC_DESIGNATOR = "+";

/** @private */
const NON_STATIC_DESIGNATOR = ".";

// FIXME: very poorly typed
export default function Logged<Instance extends object>({
	level = "info",
	mapArgs,
}: LoggedParams = {}): MethodDecorator {
	return (target, key, descriptor): void => {
		if (descriptor.value == null)
			return;

		const context = target as Instance | Constructor<Instance>;

		let logPrefix: string;

		if (context instanceof Function)
			logPrefix = context.name + STATIC_DESIGNATOR;

		else
			logPrefix = context.constructor.name + NON_STATIC_DESIGNATOR;

		const params = { prefix: `Calling: ${logPrefix}`, mapArgs } as const;
		const method = descriptor.value as unknown as Function;
		const logged: Function = function (this: typeof context, ...args) {
			logger.log(level, stringifyFunctionCall(key, args, params));
			return method.apply(this, args);
		};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		descriptor.value = logged;
	};
}
