export type MainProps = {
	children: React.ReactNode;
};

export const Main = ({ children }: MainProps) => {
	return (
		<main className="mt-0 p-2 sm:mt-3 md:max-w-5xl md:mx-auto flex w-full flex-col">
			{children}
		</main>
	);
};
