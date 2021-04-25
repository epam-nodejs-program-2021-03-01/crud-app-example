import type Entity from "../entity.type";
import client, { Model, DataTypes } from "../client";

export interface UserPublic {
	login: string;
	password: string;
	age: number;
}

export interface User extends Entity, UserPublic {
	isDeleted?: boolean;
}

export class UserModel extends Model<User, UserPublic> {}

export default UserModel;

UserModel.init({
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
});

(async () => {
	await UserModel.sync();
})();
