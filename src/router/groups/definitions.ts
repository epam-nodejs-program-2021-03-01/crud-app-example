import { Joi } from "../request-validation";
import { permissions } from "../../db/models/group";
import { naturalNumber } from "../definitions";

export { name as groupName } from "../definitions";

export const groupPermissionItem = Joi.string()
	.valid(...permissions);

export const groupPermissions = Joi.array()
	.items(groupPermissionItem);

export const includeUsersFlag = Joi.any();

export const userIDs = Joi.array()
	.items(naturalNumber);
