import { Panel } from "@versini/ui-components";

import { useContext } from "react";
import { ABOUT_TITLE } from "../../common/strings";
import { AppContext } from "../App/AppContext";
import { AboutContent } from "./AboutContent";

export const About = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { serverStats } = useContext(AppContext);

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={ABOUT_TITLE}>
			<AboutContent stats={serverStats} />
		</Panel>
	);
};
