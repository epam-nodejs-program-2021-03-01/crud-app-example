import type { Model } from "sequelize";
import type Entity from "../db/entity.type";
import Logged from "../log/logged.decorator";

/** @public */
namespace Service {
	export interface FindQuery {
		limit?: number;
	}

	export type AnyProps<Value> = Partial<Omit<Value, keyof Entity>>;
}

/** @public */
abstract class Service<
	M extends Model,
	ValueType extends ValueTypeCreation = M["_attributes"],
	ValueTypeCreation extends Record<PropertyKey, unknown> = M["_creationAttributes"],
> {
	protected abstract getRecord(id: string): Promise<M>;

	protected async updateAnyProps(id: string, props: Service.AnyProps<ValueType>): Promise<M> {
		const record = await this.getRecord(id);

		return record.update(props);
	}

	abstract find(query?: Service.FindQuery): Promise<ValueType[]>;
	abstract create(props: ValueTypeCreation): Promise<ValueType>;

	@Logged()
	async get(id: string): Promise<ValueType> {
		const record = await this.getRecord(id);

		return record.get();
	}

	@Logged()
	async update(id: string, props: Partial<ValueTypeCreation>): Promise<ValueType> {
		const record = await this.updateAnyProps(id, props as Partial<ValueType>);

		return record.get();
	}

	abstract delete(id: string): Promise<ValueType>;
}

/** @public */
namespace Service {
	export abstract class Error extends global.Error {
		abstract statusCode: number;
	}

	export abstract class ValueNotFoundError extends Error {
		statusCode = 404;
	}

	export abstract class ValueNotUniqueError extends Error {
		statusCode = 400;
	}
}

export default Service;
