import type WithTimestamps from "./with-timestamps";

export default interface Entity extends WithTimestamps {
	id: string;
}
