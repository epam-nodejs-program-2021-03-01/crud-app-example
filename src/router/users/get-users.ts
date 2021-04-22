import users, { User } from "./users";

/** @private */
interface Query {
	filter?: string;
	limit?: number;
}

export default async function getUsers({ filter = "", limit }: Query = {}): Promise<User[]> {
	let values = Object.values(users);

	if (filter)
		values = values.filter((user) => user.login.includes(filter));

	values.sort((a, b) => a.login.localeCompare(b.login));

	if (limit != null)
		values.length = limit;

	return values;
}
