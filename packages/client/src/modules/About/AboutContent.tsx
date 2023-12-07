import { Card } from "@versini/ui-components";
import { useContext } from "react";

import { CARDS } from "../../common/strings";
import { renderDataAsList } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const AboutContent = () => {
	const { state } = useContext(AppContext);

	return (
		<>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Card>
					{renderDataAsList("about", {
						[CARDS.ABOUT.VERSION]: import.meta.env.BUILDVERSION,
						[CARDS.ABOUT.BUILD_TIMESTAMP]: import.meta.env.BUILDTIME,
						[CARDS.ABOUT.ENGINE]: state?.model || null,
					})}
				</Card>
			</div>
		</>
	);
};
