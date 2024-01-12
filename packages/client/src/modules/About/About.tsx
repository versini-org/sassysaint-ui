import { Panel } from "@versini/ui-components";

import { ABOUT_TITLE } from "../../common/strings";
import { AboutContent } from "./AboutContent";

export const About = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	return (
		<Panel open={open} onOpenChange={onOpenChange} title={ABOUT_TITLE}>
			<AboutContent />
		</Panel>
	);
};
