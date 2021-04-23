import * as uuid from "uuid";
import users, { User } from "./users";

/** @private */
interface GetUsersQuery {
	filter?: string;
	limit?: number;
}

/** @private */
const publicUserKeys = [ "login", "password", "age" ] as const;

/** @private */
type PublicUserProps = Pick<User, (typeof publicUserKeys)[number]>;

/** @private */
// TypeScript weirdness
function hasKey<
	Obj extends Record<string, unknown>,
	Key extends keyof Obj,
>(
	key: Key,
	obj: Partial<Obj>,
): obj is Partial<Obj> & { [K in Key]: Obj[K] } {
	return key in obj;
}

export default class UsersService {
	createID(): string {
		return uuid.v4();
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async getUsers({ filter = "", limit }: GetUsersQuery = {}): Promise<User[]> {
		let values = Object.values(users);

		if (filter)
			values = values.filter((user) => user.login.includes(filter));

		values.sort((a, b) => a.login.localeCompare(b.login));

		if (limit != null)
			values.length = limit;

		return values.filter((user) => !user.isDeleted);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async createUser(props: PublicUserProps): Promise<string> {
		const id = this.createID();
		const user = { ...props, id };

		users[id] = user;

		return id;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async getUser(id: string): Promise<User> {
		const user = users[id] as User | undefined;

		if (user == null || user.isDeleted)
			throw new UserNotFoundError(id);

		return user;
	}

	async updateUser(id: string, props: Partial<PublicUserProps>): Promise<User> {
		const user = await this.getUser(id);

		for (const key of publicUserKeys)
			if (hasKey(key, props))
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore I don't know how to fix this error
				user[key] =
					props[key];

		return user;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
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
