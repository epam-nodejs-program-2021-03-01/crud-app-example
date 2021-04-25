export default interface Entity {
	id: string;
}

export type PickNonEntity<Type extends Entity> = Partial<Omit<Type, keyof Entity>>;
