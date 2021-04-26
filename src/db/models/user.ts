import type Entity from "../entity.type";
import client, { Model, DataTypes } from "../client";

export interface UserTypePublic {
	login: string;
	password: string;
	age: number;
}

export interface UserType extends Entity, UserTypePublic {
	isDeleted?: boolean;
}

export class User extends Model<UserType, UserTypePublic> {}

export default User;

User.init({
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
	await User.sync();
})();
