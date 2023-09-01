import { isDev } from "../../common/utilities";

export const Footer = () => {
	const buildClass = isDev ? "text-slate-900" : "text-slate-300";
	return (
		<footer className="mb-[100px] text-center text-xs text-slate-300">
			<div>
				Sassy Saint v{import.meta.env.BUILDVERSION} -{" "}
				{import.meta.env.BUILDTIME}
			</div>
			<div>Powered by OpenAI {import.meta.env.OPENAI_MODEL}</div>
			<div className={buildClass}>&copy; 2023 gizmette.com</div>
		</footer>
	);
};
