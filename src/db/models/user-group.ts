import type Entity from "../typings/entity";
import type { ImplyTimestamps } from "../typings/with-timestamps";
import client, { Model, DataTypes } from "../client";
import User from "./user";
import Group from "./group";

export interface UserGroupTypeCreation {
	userID: string;
	groupID: string;
}

export interface UserGroupType extends Entity, UserGroupTypeCreation {
}

export class UserGroup extends Model<UserGroupType, UserGroupTypeCreation> {}

export default UserGroup;

UserGroup.init<ImplyTimestamps<UserGroup>>({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	userID: {
		type: DataTypes.BIGINT,
		allowNull: false,
		references: {
			model: User,
			key: "id",
		},
	},
	groupID: {
		type: DataTypes.BIGINT,
		allowNull: false,
		references: {
			model: Group,
			key: "id",
		},
	},
}, {
	sequelize: client,
	tableName: "UserGroup",
});

User.belongsToMany(Group, {
	through: UserGroup,
	as: "groups",
	foreignKey: "userID",
});

Group.belongsToMany(User, {
	through: UserGroup,
	as: "users",
	foreignKey: "groupID",
});

UserGroup.sync();
