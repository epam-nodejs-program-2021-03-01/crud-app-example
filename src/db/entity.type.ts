export default interface Entity {
	id: string;
}

export type OmitEntity<Type extends Entity> = Partial<Omit<Type, keyof Entity>>;
