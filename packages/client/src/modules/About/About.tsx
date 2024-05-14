import { Panel } from "@versini/ui-components";

import { useEffect, useState } from "react";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/services";
import { ABOUT_TITLE } from "../../common/strings";
import { AboutContent } from "./AboutContent";

export const About = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const [stats, setStats] = useState<{
		version: string;
		models: string[];
		plugins: string[];
	}>({
		version: "",
		models: [],
		plugins: [],
	});

	useEffect(() => {
		if (!open) {
			/**
			 * Menu is closed, no pre-fetching
			 */
			return;
		}
		(async () => {
			try {
				const response = await graphQLCall({
					query: GRAPHQL_QUERIES.ABOUT,
					data: {},
				});

				if (response.status === 200) {
					const data = await response.json();
					setStats(data.data.about);
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [open]);

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={ABOUT_TITLE}>
			<AboutContent stats={stats} />
		</Panel>
	);
};
