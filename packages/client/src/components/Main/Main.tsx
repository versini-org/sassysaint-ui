export type MainProps = {
	children: React.ReactNode;
};

export const Main = ({ children }: MainProps) => {
	return (
		<main className="mt-0 flex w-full flex-col p-2 sm:mt-3 md:mx-auto md:max-w-4xl">
			{children}
		</main>
	);
};
