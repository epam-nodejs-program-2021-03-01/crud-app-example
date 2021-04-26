import { Op } from "sequelize";
import type Entity from "../typings/db/entity";
import User, { UserType, UserTypeRequired } from "../db/models/user";

/** @private */
interface FindQuery {
	filter?: string;
	limit?: number;
}

/** @private */
interface CreateUserResult {
	id: string;
	createdAt: string;
}

/** @private */
type AnyProps = Omit<UserType, keyof Entity>;

export default class UserService {
	private async getRecord(id: string): Promise<User> {
		const record = await User.findOne({
			where: {
				id,
				isDeleted: false,
			},
		});

		if (record == null)
			throw new UserNotFoundError(id);

		return record;
	}

	private async updateAnyProps(id: string, props: Partial<AnyProps>): Promise<UserType> {
		const record = await this.getRecord(id);

		await record.update(props);

		return record.get();
	}

	async find({ filter = "", limit }: FindQuery = {}): Promise<UserType[]> {
		const records = await User.findAll({
			where: {
				login: {
					[Op.like]: `%${filter}%`,
				},
				isDeleted: "false",
			},
			order: [['login', 'ASC']],
			limit,
		});

		return records.map((record) => record.get());
	}

	async create(props: UserTypeRequired): Promise<CreateUserResult> {
		const record = await User.create(props);

		const { id, createdAt } = record.get();

		return { id, createdAt };
	}

	async get(id: string): Promise<UserType> {
		const record = await this.getRecord(id);

		return record.get();
	}

	async update(id: string, props: Partial<UserTypeRequired>): Promise<UserType> {
		return this.updateAnyProps(id, props);
	}

	async delete(id: string): Promise<UserType> {
		return this.updateAnyProps(id, { isDeleted: true });
	}
}

export class UserNotFoundError extends Error {
	constructor(userID: string) {
		super(`User "${userID}" was not found`);
	}
}
