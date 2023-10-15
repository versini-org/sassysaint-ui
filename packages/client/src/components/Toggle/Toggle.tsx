export type ToggleProps = {
	checked?: boolean;
	onChange: (checked: boolean) => void;
};
export const Toggle = ({ checked = false, onChange }: ToggleProps) => {
	return (
		<label className="relative flex cursor-pointer items-center">
			<input
				defaultChecked={checked}
				type="checkbox"
				value=""
				className="peer sr-only"
				onChange={(e) => onChange(e.target.checked)}
			/>
			<div className="peer h-6 w-11 rounded-full  border-slate-600 bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#5bc236] peer-checked:after:translate-x-full peer-checked:after:border-white  peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white"></div>
		</label>
	);
};
