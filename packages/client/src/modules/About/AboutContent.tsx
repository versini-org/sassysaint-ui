import { Card } from "@versini/ui-card";
import { useUniqueId } from "@versini/ui-hooks";

import { CARDS } from "../../common/strings";
import type { ServerStatsProps } from "../../common/types";
import { pluralize, renderDataAsList } from "../../common/utilities";

export const AboutContent = ({ stats }: { stats?: ServerStatsProps }) => {
	const plugins = stats?.plugins || [];
	const version = stats?.version || "";
	const models = stats?.models || [];
	const listIdClient = useUniqueId();
	const listIdServer = useUniqueId();

	return (
		<>
			<div className="mb-4">
				<Card
					header={CARDS.ABOUT.TITLE_CLIENT}
					className="prose-dark dark:prose-lighter"
				>
					{renderDataAsList(listIdClient, {
						[CARDS.ABOUT.VERSION]: import.meta.env.BUILDVERSION,
						[CARDS.ABOUT.BUILD_TIMESTAMP]: import.meta.env.BUILDTIME,
					})}
				</Card>
			</div>

			<Card
				header={CARDS.ABOUT.TITLE_SERVER}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList(listIdServer, {
					[CARDS.ABOUT.VERSION]: version,

					[pluralize(CARDS.ABOUT.ENGINE, models.length)]: (
						<>
							{models.map((model: string) => (
								<div key={model} className="text-right">
									{model}
								</div>
							))}
						</>
					),
					[pluralize(CARDS.ABOUT.PLUGIN, plugins.length)]: (
						<>
							{plugins.map((plugin: string) => (
								<div key={plugin} className="text-right">
									{plugin}
								</div>
							))}
						</>
					),
				})}
			</Card>
		</>
	);
};
