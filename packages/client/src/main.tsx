import "./index.css";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";

import { isDev, isProd } from "./common/utilities";
import { getConfig } from "./config";
import { Login } from "./modules/Login/Login";
const LazyApp = lazy(() => import("./modules/App/App"));

const config = getConfig();

const AppBootstrap = () => {
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

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
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
				<AppBootstrap />
			</Auth0Provider>
		)}
	</React.StrictMode>,
);
