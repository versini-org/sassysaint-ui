export const Footer = () => {
	return (
		<footer className="mb-[100px] text-center text-xs text-slate-300">
			<div>
				Sassy Saint v{import.meta.env.BUILDVERSION} -{" "}
				{import.meta.env.BUILDTIME}
			</div>
			<div>Powered by OpenAI {import.meta.env.OPENAI_MODEL}</div>
			<div>&copy; 2023 gizmette.com</div>
		</footer>
	);
};
