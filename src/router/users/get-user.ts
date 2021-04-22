import users, { User } from "./users";
import UserNotFoundError from "./user-not-found-error";

export default async function getUser(id: string): Promise<User> {
	const user = users[id] as User | undefined;

	if (user == null || user.isDeleted)
		throw new UserNotFoundError(id);

	return user;
}
