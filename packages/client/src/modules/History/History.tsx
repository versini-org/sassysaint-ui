import { Panel } from "@versini/ui-panel";

import { HISTORY_TITLE } from "../../common/strings";
import { HistoryContent } from "./HistoryContent";

export const History = ({
	open,
	onOpenChange,
	historyData,
}: {
	historyData: any[];
	onOpenChange: any;
	open: boolean;
}) => {
	return (
		<Panel
			open={open}
			onOpenChange={onOpenChange}
			title={HISTORY_TITLE}
			className="max-2-xl sm:max-w-4xl xl:max-w-5xl"
		>
			<HistoryContent onOpenChange={onOpenChange} historyData={historyData} />
		</Panel>
	);
};
