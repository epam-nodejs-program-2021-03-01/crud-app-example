import { Op } from "sequelize";
import Group, { GroupType, GroupTypeCreation } from "../db/models/group";
import Service from "./abstract.service";

/** @private */
interface FindQuery extends Service.FindQuery {
	filter?: string;
}

export default class GroupService extends Service<Group> {
	protected async getRecord(id: string): Promise<Group> {
		const record = await Group.findByPk(id);

		if (record == null)
			throw new GroupNotFoundError(id);

		return record;
	}

	async find({ filter = "", limit }: FindQuery = {}): Promise<GroupType[]> {
		const records = await Group.findAll({
			where: {
				name: {
					[Op.like]: `%${filter}%`,
				},
			},
			limit,
		});

		return records.map((record) => record.get());
	}

	async create(props: GroupTypeCreation): Promise<GroupType> {
		const record = await Group.create(props);

		return record.get();
	}

	async delete(id: string): Promise<GroupType> {
		const record = await this.getRecord(id);

		await record.destroy();

		return record.get();
	}
}

export class GroupNotFoundError extends Service.ValueNotFoundError {
	constructor(groupID: string) {
		super(`Group "${groupID}" was not found`);
	}
}
