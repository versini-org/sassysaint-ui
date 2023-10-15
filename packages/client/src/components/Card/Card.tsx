import clsx from "clsx";

export type CardProps = {
	className?: string;
	title?: string;
	subTitle?: string;
	data?: {
		[key: string]: string | number | undefined | React.ReactNode;
	};
	rawData?: React.ReactNode;
	noBackground?: boolean;
};

export const Card = ({
	title,
	subTitle,
	data,
	rawData,
	noBackground = false,
	className,
}: CardProps) => {
	const titleClass = clsx("text-lg font-bold", {
		"mb-4": !!subTitle,
	});
	const cardClass = clsx("rounded-md text-slate-200", className, {
		"border-2 border-slate-900 bg-slate-900 p-4": !noBackground,
	});

	return (
		<div className={cardClass}>
			{title && <h2 className={titleClass}>{title}</h2>}
			{subTitle && <h3 className="mb-4 text-sm">{subTitle}</h3>}
			{data &&
				Object.keys(data).map((idx) => {
					return (
						<dl className="mb-5" key={`${title}-${idx}`}>
							<div className="flex items-center justify-between">
								<dt className="inline-block font-bold text-slate-400">{idx}</dt>
								<dd className="inline-block">{data[idx]}</dd>
							</div>
						</dl>
					);
				})}
			{rawData && rawData}
		</div>
	);
};
