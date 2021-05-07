import Group from "./models/group";
import User from "./models/user";
import UserGroup from "./models/user-group";

export default async function synchronizeModels(): Promise<void> {
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

	await Promise.all([
		UserGroup.sync(),
		User.sync(),
		Group.sync(),
	]);
}
