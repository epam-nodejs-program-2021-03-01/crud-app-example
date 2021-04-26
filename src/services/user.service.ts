import { Op } from "sequelize";
import type { PickNonEntity } from "../db/entity.type";
import User, { UserType, UserTypePublic } from "../db/models/user";

/** @private */
interface FindQuery {
	filter?: string;
	limit?: number;
}

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

	private async updateAnyProps(id: string, props: PickNonEntity<UserType>): Promise<UserType> {
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

	async create(props: UserTypePublic): Promise<string> {
		const record = await User.create(props);

		return record.getDataValue("id");
	}

	async get(id: string): Promise<UserType> {
		const record = await this.getRecord(id);

		return record.get();
	}

	async update(id: string, props: Partial<UserTypePublic>): Promise<UserType> {
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
