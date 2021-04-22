import users, { User } from "./users";
import UserNotFoundError from "./user-not-found-error";

export default async function deleteUser(id: string): Promise<User> {
	if (id in users === false)
		throw new UserNotFoundError(id);

	const user = users[id];

	user.isDeleted = true; // soft delete

	return user;
}
