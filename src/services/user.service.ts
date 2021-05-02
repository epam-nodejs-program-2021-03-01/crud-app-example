import { Op } from "sequelize";
import User, { UserType, UserTypeCreation } from "../db/models/user";
import Service from "./abstract.service";

/** @private */
interface FindQuery extends Service.FindQuery {
	filter?: string;
}

export default class UserService extends Service<User> {
	protected async getRecord(id: string): Promise<User> {
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

	async create(props: UserTypeCreation): Promise<UserType> {
		const record = await User.create(props);

		return record.get();
	}

	async delete(id: string): Promise<UserType> {
		const record = await this.updateAnyProps(id, { isDeleted: true });

		return record.get();
	}
}

export class UserNotFoundError extends Service.ValueNotFoundError {
	constructor(userID: string) {
		super(`User "${userID}" was not found`);
	}
}
