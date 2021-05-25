import express from "express";
import supertest from "supertest";
import User, { UserTypeCreation } from "../../db/models/user";
import UserService from "../../services/user.service";
import createRouter from "../create-router";
import createUser from "./create-user.controller";

class UserServiceMock extends UserService {
	async createRecord(props: UserTypeCreation): Promise<User> {
		return User.build(props);
	}
}

const app = express().use(createRouter({
	"/users": {
		post: createUser({
			userService: new UserServiceMock(),
		}),
	},
}));

const request = supertest(app);

describe("POST /users", () => request); // TODO: ...
