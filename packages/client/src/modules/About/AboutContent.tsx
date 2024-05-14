import { Card } from "@versini/ui-components";
import { useContext } from "react";

import { CARDS } from "../../common/strings";
import { renderDataAsList } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const AboutContent = ({
	stats,
}: { stats: { plugins: string[]; version: string; models: string[] } }) => {
	const { state } = useContext(AppContext);

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
						[CARDS.ABOUT.ENGINE]: state?.model || null,
					})}
				</Card>
			</div>
			<Card
				header={CARDS.ABOUT.TITLE_SERVER}
				className="prose-dark dark:prose-lighter"
			>
				{renderDataAsList("about", {
					[CARDS.ABOUT.VERSION]: version,

					[CARDS.ABOUT.ENGINES]: (
						<>
							{models.map((model: string) => (
								<div key={model} className="text-right">
									{model}
								</div>
							))}
						</>
					),
					[CARDS.ABOUT.PLUGINS]: (
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
