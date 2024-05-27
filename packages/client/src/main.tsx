import React from "react";
import ReactDOM from "react-dom/client";
import { AppBootstrap } from "./modules/App/AppBootstrap";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AppBootstrap />
	</React.StrictMode>,
);
