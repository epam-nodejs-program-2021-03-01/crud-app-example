import type { Model } from "sequelize";
import type Entity from "../db/entity.type";

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

	async get(id: string): Promise<ValueType> {
		const record = await this.getRecord(id);

		return record.get();
	}

	async update(id: string, props: Partial<ValueTypeCreation>): Promise<ValueType> {
		const record = await this.updateAnyProps(id, props as Partial<ValueType>);

		return record.get();
	}

	abstract delete(id: string): Promise<ValueType>;
}

/** @public */
namespace Service {
	export class Error extends global.Error {
	}

	export class ValueNotFoundError extends Error {
	}
}

export default Service;
