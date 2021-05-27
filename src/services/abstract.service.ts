/** @private */
function hasProp<Key extends PropertyKey>(obj: object, key: Key): obj is { [K in Key]: unknown } {
	return key in obj;
}

/** @public */
abstract class Service {
	protected expectDependency<
		Name extends string,
		Dependency extends Service,
	>(name: Name): asserts this is { [N in Name]: Dependency } {
		if (!hasProp(this, name) || this[name] == null)
			throw new ServiceDependencyMissingError(name, this);
	}
}

/** @public */
namespace Service {
	/**
	 * The purpose of `Service.Error` class is to distinguish well-defined
	 * client-facing errors from internal, possibly unexpected errors.
	 *
	 * For example, a `UserNotFoundError` is a perfectly valid result of
	 * `UserService` correctly doing its job, and it is something that clients
	 * expect to see, – therefore `UserNotFoundError` is a descendant of `Service.Error`;
	 * whereas, `ServiceDependencyMissingError` is an error that means that a service cannot
	 * do its job correctly because of a missing dependency, – it is not a client-facing
	 * error (clients should not see this), – therefore it is not a `Service.Error`.
	 */
	export abstract class Error extends global.Error {
		abstract statusCode: number;
	}
}

export default Service;

export class ServiceDependencyMissingError extends Error {
	constructor(dependencyName: string, service: Service) {
		super(`An instance of ${service.constructor.name} is missing a required dependency "${dependencyName}"`);
	}
}
