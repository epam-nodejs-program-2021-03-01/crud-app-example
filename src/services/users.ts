export interface User {
	readonly id: string;
	login: string;
	password: string;
	age: number;
	isDeleted?: boolean;
}

/** @public */
const users: Record<string, User> = Object.create(null);

users["b874d5e6-3ffc-42b4-b06f-b3e929521c04"] = {
	id: "b874d5e6-3ffc-42b4-b06f-b3e929521c04",
	login: "alice-donovan",
	password: "alice-donovan-password!@#",
	age: 17,
};

users["917d91ff-ef5b-41b4-9547-7ec8d956fdba"] = {
	id: "917d91ff-ef5b-41b4-9547-7ec8d956fdba",
	login: "bob-townes",
	password: "bob-townes-password!@#",
	age: 42,
};

users["06f9b3e5-02a2-416f-b2bc-0b775afab74d"] = {
	id: "06f9b3e5-02a2-416f-b2bc-0b775afab74d",
	login: "cecilia-townes",
	password: "cecilia-townes-password!@#",
	age: 51,
};

users["3ce56711-fef5-4176-b32d-86c9bd472484"] = {
	id: "3ce56711-fef5-4176-b32d-86c9bd472484",
	login: "dave-donovan",
	password: "dave-donovan-password!@#",
	age: 28,
};

export default users;
