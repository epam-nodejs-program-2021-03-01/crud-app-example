import type Entity from "../../typings/db/entity";
import type { ImplyTimestamps } from "../../typings/db/with-timestamps";
import client, { Model, DataTypes } from "../client";

export type Permission =
	| "READ"
	| "WRITE"
	| "DELETE"
	| "SHARE"
	| "UPLOAD_FILES"
	;

export interface GroupTypeCreation {
	name: string;
	permissions: Permission[];
}

export interface GroupType extends Entity, GroupTypeCreation {
}

export class Group extends Model<GroupType, GroupTypeCreation> {}

export default Group;

Group.init<ImplyTimestamps<Group>>({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	permissions: {
		type: DataTypes.ARRAY(DataTypes.ENUM<Permission>({
			values: [ "READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES" ],
		})),
		allowNull: false,
		defaultValue: [],
	},
}, {
	sequelize: client,
	tableName: "Groups",
});

(async () => {
	await Group.sync<Group>();
})();
