import React from "react";
import ReactDOM from "react-dom/client";
import { DOMAIN } from "./common/utilities";
import { AppBootstrap } from "./modules/App/AppBootstrap";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AppBootstrap isComponent={false} domain={DOMAIN} />
	</React.StrictMode>,
);
