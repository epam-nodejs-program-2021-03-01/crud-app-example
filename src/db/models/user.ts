import type Entity from "../../typings/db/entity";
import type { ImplyTimestamps } from "../../typings/db/with-timestamps.type";
import client, { Model, DataTypes } from "../client";

export interface UserTypeRequired {
	login: string;
	password: string;
	age: number;
}

export interface UserType extends Entity, UserTypeRequired {
	isDeleted?: boolean;
}

export class User extends Model<UserType, UserTypeRequired> {}

export default User;

User.init<ImplyTimestamps<User>>({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	login: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	isDeleted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
}, {
	sequelize: client,
	tableName: "Users",
});

(async () => {
	await User.sync<User>();
})();
