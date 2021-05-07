import type Entity from "../entity.type";
import type { ImplyTimestamps } from "../with-timestamps.type";
import client, { Model, DataTypes } from "../client";

export interface UserTypeCreation {
	login: string;
	password: string;
	age: number;
}

export interface UserType extends Entity, UserTypeCreation {
	isDeleted?: boolean;
}

export class User extends Model<UserType, UserTypeCreation> {}

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
		unique: "user_login",
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
	indexes: [
		{
			name: "user_login",
			fields: [ "login" ],
			unique: true,
		},
	],
});
