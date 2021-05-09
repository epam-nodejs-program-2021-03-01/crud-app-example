/** @public */
abstract class Service {
}

/** @public */
namespace Service {
	export abstract class Error extends global.Error {
		abstract statusCode: number;
	}
}

export default Service;
