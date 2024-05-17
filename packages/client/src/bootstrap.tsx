import { useAuth0 } from "@auth0/auth0-react";
import { Suspense, lazy } from "react";
import { isDev, isProd } from "./common/utilities";
import { Login } from "./modules/Login/Login";

const LazyApp = lazy(() => import("./modules/App/App"));

export const AppBootstrap = () => {
	const { isAuthenticated, isLoading } = useAuth0();
	if (!isAuthenticated && isProd) {
		return <Login />;
	}
	return isLoading && !isDev ? null : (
		<Suspense fallback={<div />}>
			<LazyApp />
		</Suspense>
	);
};
