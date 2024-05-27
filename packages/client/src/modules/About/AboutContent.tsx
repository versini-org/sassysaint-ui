import { Card } from "@versini/ui-components";

import { CARDS } from "../../common/strings";
import type { ServerStatsProps } from "../../common/types";
import { pluralize, renderDataAsList } from "../../common/utilities";

export const AboutContent = ({ stats }: { stats?: ServerStatsProps }) => {
	const plugins = stats?.plugins || [];
	const version = stats?.version || "";
	const models = stats?.models || [];

	return (
		<>
			<div className="mb-4">
				<Card
					header={CARDS.ABOUT.TITLE_CLIENT}
					className="prose-dark dark:prose-lighter"
				>
					{renderDataAsList("about", {
						[CARDS.ABOUT.VERSION]: import.meta.env.BUILDVERSION,
						[CARDS.ABOUT.BUILD_TIMESTAMP]: import.meta.env.BUILDTIME,
					})}
				</Card>
			</div>
			<Card
				header={CARDS.ABOUT.TITLE_SERVER}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList("about", {
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
