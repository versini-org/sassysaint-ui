import "./index.css";

import { Auth0Provider } from "@auth0/auth0-react";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";

import { AppBootstrap } from "./bootstrap";
import { isDev } from "./common/utilities";
import { getConfig } from "./config";
const LazyApp = lazy(() => import("./modules/App/App"));

const config = getConfig();

const providerConfig = {
	domain: config.domain,
	clientId: config.clientId,
	authorizationParams: {
		redirect_uri: window.location.origin,
		...(config.audience ? { audience: config.audience } : undefined),
	},
};

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{isDev ? (
			<Suspense fallback={<div />}>
				<LazyApp />
			</Suspense>
		) : (
			<Auth0Provider {...providerConfig}>
				<AppBootstrap />
			</Auth0Provider>
		)}
	</React.StrictMode>,
);
