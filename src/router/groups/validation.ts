import { GroupTypeCreation, permissions } from "../../db/models/group";
import createValidator, { Joi, Segments } from "../create-validator";
import type DefineValidRequest from "../define-valid-request.type";
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

export namespace requests {
	export type GetGroup = DefineValidRequest<unknown, GetGroupQuery>;
	export type CreateGroup = DefineValidRequest<GroupTypeCreation>;
	export type UpdateGroup = DefineValidRequest<Partial<GroupTypeCreation>>;
	export type AddUsers = DefineValidRequest<WithUserIDs>;
	export type RemoveUsers = DefineValidRequest<WithUserIDs>;
}

export namespace validators {
	export const forGetGroup = createValidator({
		[Segments.QUERY]: Joi.object<GetGroupQuery>({
			users: includeUsersFlag,
		}),
	});

	export const forCreateGroup = createValidator({
		[Segments.BODY]: Joi.object<GroupTypeCreation>({
			name: name.required(),
			permissions: groupPermissions.required(),
		}),
	});

	export const forUpdateGroup = createValidator({
		[Segments.BODY]: Joi.object<GroupTypeCreation>({
			name,
			permissions: groupPermissions,
		}),
	});

	export const forAddUsers = createValidator({
		[Segments.BODY]: Joi.object<WithUserIDs>({
			userIDs: userIDs.required(),
		}),
	});

	export const forRemoveUsers = createValidator({
		[Segments.BODY]: Joi.object<WithUserIDs>({
			userIDs: userIDs.required(),
		}),
	});
}
