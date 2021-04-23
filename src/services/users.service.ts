import * as uuid from "uuid";
import users, { User } from "./users";

/** @private */
interface GetUsersQuery {
	filter?: string;
	limit?: number;
}

/** @private */
type CreateUserProps = Pick<User, "login" | "password" | "age">;

export default class UsersService {
	createID() {
		return uuid.v4();
	}

	async getUsers({ filter = "", limit }: GetUsersQuery = {}): Promise<User[]> {
		let values = Object.values(users);

		if (filter)
			values = values.filter((user) => user.login.includes(filter));

		values.sort((a, b) => a.login.localeCompare(b.login));

		if (limit != null)
			values.length = limit;

		return values.filter((user) => !user.isDeleted);
	}

	async createUser(props: CreateUserProps): Promise<string> {
		const id = this.createID();
		const user = { ...props, id };

		users[id] = user;

		return id;
	}

	async getUser(id: string): Promise<User> {
		const user = users[id] as User | undefined;

		if (user == null || user.isDeleted)
			throw new UserNotFoundError(id);

		return user;
	}

	async deleteUser(id: string): Promise<User> {
		if (id in users === false)
			throw new UserNotFoundError(id);

		const user = users[id];

		user.isDeleted = true; // soft delete

		return user;
	}
}

export class UserNotFoundError extends Error {
	constructor(userID: string) {
		super(`User "${userID}" was not found`);
	}
}
