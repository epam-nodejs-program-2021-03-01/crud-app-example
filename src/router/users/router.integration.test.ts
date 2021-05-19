import supertest from "supertest";
import app from "../../app";
import client from "../../db/client";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

const request = supertest(app);

const authService = new AuthService();
	const userService = new UserService();

function getToken() {
	const { token } = authService.issueToken({ lifespan: "1min" });

	return token;
}

async function createDeletedUserID() {
	const user = await userService.create({
		login: "test-user-" + Date.now(),
		age: 42,
		password: "test-user-Password123",
	});

	await userService.delete(user.id);

	return user.id;
}

describe("GET /users/:id", () => {
	afterAll(() => client.close());

	it("should return 404 response for users that were deleted from DB", async () => {
		const id = await createDeletedUserID();

		await request.get(`/users/${id}`)
			.set("Authorization", `Bearer ${getToken()}`)
			.expect(404);
	});

	it("should return 404 response for users that do not physically exist in DB", async () => {
		await request.get("/users/0")
			.set("Authorization", `Bearer ${getToken()}`)
			.expect(404);
	});
});
