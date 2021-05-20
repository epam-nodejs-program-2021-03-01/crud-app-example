import logger, { Level } from "./logger";

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
}

/** @private */
const STATIC_DESIGNATOR = "+";

/** @private */
const NON_STATIC_DESIGNATOR = ".";

/** @private */
function toName(key: PropertyKey): string {
	if (typeof key === "string")
		return key;

	// [42](), [Symbol.method]()
	return `[${String(key)}]`;
}

/** @private */
function stringifyArg(value: unknown, index: number): string {
	try {
		return JSON.stringify(value);
	} catch (error) {
		return `$${index + 1}`;
	}
}

/** @private */
function toArgs(values: unknown[]): string {
	return values.map(stringifyArg).join(", ");
}

// FIXME: very poorly typed
export default function Logged<Instance extends object>({
	level = "info",
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

		const method = descriptor.value as unknown as Function;
		const logged: Function = function (this: typeof context, ...args) {
			const callName = toName(key);
			const callArgs = toArgs(args);

			logger.log(level, `Calling: ${logPrefix + callName}(${callArgs})`);
			return method.apply(this, args);
		};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		descriptor.value = logged;
	};
}
