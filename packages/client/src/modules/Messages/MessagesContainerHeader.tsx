import { useAuth } from "@versini/auth-provider";
import { IconDog } from "@versini/ui-icons";
import { Suspense, lazy } from "react";

import { APP_MOTTO, APP_NAME } from "../../common/strings";

const LazyHeader = lazy(
	() => import(/* webpackChunkName: "LazyHeader" */ "./LazyHeader"),
);

export const MessagesContainerHeader = () => {
	const { isAuthenticated } = useAuth();

	return (
		<>
			{isAuthenticated && (
				<Suspense fallback={<div />}>
					<LazyHeader />
				</Suspense>
			)}

			<div className="flex items-center justify-center">
				<div className="basis-1/4">
					<IconDog />
				</div>
				<div className="prose prose-light prose-sm md:prose-base prose-h1:mb-0 prose-h2:mt-0  prose-h1:text-2xl">
					<h1>{APP_NAME}</h1>
					<h2>{APP_MOTTO}</h2>
				</div>
			</div>
		</>
	);
};
