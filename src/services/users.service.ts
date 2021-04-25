import { Op } from "sequelize";
import type { PickNonEntity } from "../db/entity.type";
import UserModel, { User, UserPublic } from "../db/models/user";

/** @private */
interface GetUsersQuery {
	filter?: string;
	limit?: number;
}

export default class UsersService {
	private async getUserRecord(id: string): Promise<UserModel> {
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

	private async updateUserAnyProps(id: string, props: PickNonEntity<User>): Promise<User> {
		const record = await this.getUserRecord(id);

		await record.update(props);

		return record.get();
	}

	async getUsers({ filter = "", limit }: GetUsersQuery = {}): Promise<User[]> {
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

	async createUser(props: UserPublic): Promise<string> {
		const record = await UserModel.create(props);

		return record.getDataValue("id");
	}

	async getUser(id: string): Promise<User> {
		const record = await this.getUserRecord(id);

		return record.get();
	}

	async updateUser(id: string, props: Partial<UserPublic>): Promise<User> {
		return this.updateUserAnyProps(id, props);
	}

	async deleteUser(id: string): Promise<User> {
		return this.updateUserAnyProps(id, { isDeleted: true });
	}
}

export class UserNotFoundError extends Error {
	constructor(userID: string) {
		super(`User "${userID}" was not found`);
	}
}
