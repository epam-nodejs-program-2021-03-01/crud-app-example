import { Op } from "sequelize";
import type { PickNonEntity } from "../db/entity.type";
import UserModel, { User, UserPublic } from "../db/models/user";

/** @private */
interface FindQuery {
	filter?: string;
	limit?: number;
}

export default class UsersService {
	private async getRecord(id: string): Promise<UserModel> {
		const record = await UserModel.findOne({
			where: {
				id,
				isDeleted: false,
			},
		});

		if (record == null)
			throw new UserNotFoundError(id);

		return record;
	}

	private async updateAnyProps(id: string, props: PickNonEntity<User>): Promise<User> {
		const record = await this.getRecord(id);

		await record.update(props);

		return record.get();
	}

	async find({ filter = "", limit }: FindQuery = {}): Promise<User[]> {
		const records = await UserModel.findAll({
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

	async create(props: UserPublic): Promise<string> {
		const record = await UserModel.create(props);

		return record.getDataValue("id");
	}

	async get(id: string): Promise<User> {
		const record = await this.getRecord(id);

		return record.get();
	}

	async update(id: string, props: Partial<UserPublic>): Promise<User> {
		return this.updateAnyProps(id, props);
	}

	async delete(id: string): Promise<User> {
		return this.updateAnyProps(id, { isDeleted: true });
	}
}

export class UserNotFoundError extends Error {
	constructor(userID: string) {
		super(`User "${userID}" was not found`);
	}
}
