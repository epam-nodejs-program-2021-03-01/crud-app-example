import Logged from "../log/logged.decorator";

/** @public */
abstract class Service {
	constructor(
		protected deps: Record<string, Service> = Object.create(null),
	) {}

	@Logged({ level: "debug" })
	protected expectDependency<
		Name extends string,
		Dependency extends Service,
	>(name: Name): asserts this is { deps: { [N in Name]: Dependency } } {
		if ((this.deps[name] instanceof Service) === false)
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
