import "../../index.css";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { Suspense, lazy } from "react";

import { isDev, isProd } from "../../common/utilities";
import { getConfig } from "../../config";
import { Login } from "../../modules/Login/Login";
const LazyApp = lazy(() => import("./App"));

const config = getConfig();

const Bootstrap = () => {
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

export const AppBootstrap = () => {
	return (
		<>
			{isDev ? (
				<Suspense fallback={<div />}>
					<LazyApp />
				</Suspense>
			) : (
				<Auth0Provider
					domain={config.domain}
					clientId={config.clientId}
					sessionCheckExpiryDays={90}
					useRefreshTokens={true}
					legacySameSiteCookie={false}
					cacheLocation="localstorage"
					authorizationParams={{
						redirect_uri: window.location.origin,
						...(config.audience ? { audience: config.audience } : undefined),
					}}
				>
					<Bootstrap />
				</Auth0Provider>
			)}
		</>
	);
};
