import { useContext } from "react";

import { CARDS } from "../../common/strings";
import { Card } from "../../components";
import { AppContext } from "../App/AppContext";

export const AboutContent = () => {
	const { state } = useContext(AppContext);

	return (
		<>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Card
					className="w-full"
					data={{
						[CARDS.ABOUT.VERSION]: import.meta.env.BUILDVERSION,
						[CARDS.ABOUT.BUILD_TIMESTAMP]: import.meta.env.BUILDTIME,
						[CARDS.ABOUT.ENGINE]: state?.model || null,
					}}
				/>
			</div>
		</>
	);
};
