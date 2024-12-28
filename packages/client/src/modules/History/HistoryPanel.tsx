import { Panel } from "@versini/ui-panel";

import { HISTORY_TITLE } from "../../common/strings";
import { HistoryContent } from "./HistoryContent";

export const HistoryPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	return (
		<Panel open={open} onOpenChange={onOpenChange} title={HISTORY_TITLE}>
			<HistoryContent onOpenChange={onOpenChange} />
		</Panel>
	);
};
