import { GroupTypeCreation, permissions } from "../../db/models/group";
import RequestValidation, { Joi, Segments } from "../request-validation";
import { name, naturalNumber } from "../definitions";

/** @private */
interface WithUserIDs {
	userIDs: string[];
}

/** @private */
interface GetGroupQuery {
	users?: "false" | 0 | "0" | unknown;
}

/** @private */
const groupPermissionItem = Joi.string()
	.valid(...permissions);

/** @private */
const groupPermissions = Joi.array()
	.items(groupPermissionItem);

/** @private */
const userIDs = Joi.array()
	.items(naturalNumber);

/** @private */
const includeUsersFlag = Joi.any();

export const getGroup = new RequestValidation<unknown, GetGroupQuery>({
	[Segments.QUERY]: Joi.object<GetGroupQuery>({
		users: includeUsersFlag,
	}),
});

export const createGroup = new RequestValidation<GroupTypeCreation>({
	[Segments.BODY]: Joi.object<GroupTypeCreation>({
		name: name.required(),
		permissions: groupPermissions.required(),
	}),
});

export const updateGroup = new RequestValidation<Partial<GroupTypeCreation>>({
	[Segments.BODY]: Joi.object<GroupTypeCreation>({
		name,
		permissions: groupPermissions,
	}),
});

export const addUsers = new RequestValidation<WithUserIDs>({
	[Segments.BODY]: Joi.object<WithUserIDs>({
		userIDs: userIDs.required(),
	}),
});

export const removeUsers = new RequestValidation<WithUserIDs>({
	[Segments.BODY]: Joi.object<WithUserIDs>({
		userIDs: userIDs.required(),
	}),
});
