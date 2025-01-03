import { IconDog } from "@versini/ui-icons";
import { APP_MOTTO, APP_NAME } from "../../common/strings";

export const Logo = () => {
	return (
		<div className="flex items-center justify-center">
			<div className="basis-1/4">
				<IconDog />
			</div>
			<div className="prose prose-sm prose-light md:prose-base prose-h1:mb-0 prose-h2:mt-0">
				<h1>{APP_NAME}</h1>
				<h2>{APP_MOTTO}</h2>
			</div>
		</div>
	);
};
