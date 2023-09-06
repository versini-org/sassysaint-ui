import clsx from "clsx";

export type CardProps = {
	className?: string;
	title: string;
	subTitle?: string;
	data: {
		[key: string]: string | number | undefined | React.ReactNode;
	};
};

export const Card = ({ title, subTitle, data, className }: CardProps) => {
	const titleClass = subTitle ? "font-bold text-lg" : "font-bold text-lg mb-4";
	const cardClass = clsx(
		"rounded-md p-4 border-slate-900 border-2 bg-slate-900 text-slate-200",
		className,
	);
	return (
		<div className={cardClass}>
			<h2 className={titleClass}>{title}</h2>
			{subTitle && <h3 className="text-sm mb-4">{subTitle}</h3>}
			{Object.keys(data).map((idx) => {
				return (
					<dl className="mb-5" key={`${title}-${idx}`}>
						<div className="flex justify-between items-center">
							<dt className="font-bold text-slate-400 inline-block">{idx}</dt>
							<dd className="inline-block">{data[idx]}</dd>
						</div>
					</dl>
				);
			})}
		</div>
	);
};
