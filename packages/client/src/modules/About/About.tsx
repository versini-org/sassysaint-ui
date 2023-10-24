import { ABOUT_TITLE } from "../../common/strings";
import { Panel } from "../../components";
import { AboutContent } from "./AboutContent";

export const About = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: any;
}) => {
	return (
		<Panel open={open} onOpenChange={onOpenChange} title={ABOUT_TITLE}>
			<AboutContent />
		</Panel>
	);
};
