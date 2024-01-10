import "./index.css";

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom/client";

import { isDev } from "./common/utilities";
import { getConfig } from "./config";
import App from "./modules/App/App";

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
			<App />
		) : (
			<Auth0Provider {...providerConfig}>
				<App />
			</Auth0Provider>
		)}
	</React.StrictMode>,
);
