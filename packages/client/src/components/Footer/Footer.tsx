import { useContext } from "react";

import { APP_NAME, APP_OWNER, POWERED_BY } from "../../common/strings";
import { isDev } from "../../common/utilities";
import { AppContext } from "../../modules/AppContext";

export const Footer = () => {
	const { state } = useContext(AppContext);
	const buildClass = isDev ? "text-slate-900" : "text-slate-300";
	return (
		<footer className="mb-[100px] text-center text-xs text-slate-300">
			<div>
				{APP_NAME} v{import.meta.env.BUILDVERSION} - {import.meta.env.BUILDTIME}
			</div>
			<div>
				{POWERED_BY} {state?.model}
			</div>
			<div className={buildClass}>
				&copy; {new Date().getFullYear()} {APP_OWNER}
			</div>
		</footer>
	);
};
