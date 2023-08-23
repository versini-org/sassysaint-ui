import { IconDog } from "../Icons";

export const MessagesContainerHeader = () => {
	return (
		<div className="flex items-center justify-center">
			<div className="basis-1/4">
				<IconDog />
			</div>
			<div>
				<h1 className="text-2xl font-bold text-slate-300">Sassy Saint</h1>
				<h2 className="text-slate-300">ASK! ME! ANYTHING!</h2>
			</div>
		</div>
	);
};
