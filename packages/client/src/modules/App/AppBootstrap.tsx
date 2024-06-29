import "../../index.css";

import { AuthProvider, useAuth } from "@versini/auth-provider";
import { Suspense, lazy } from "react";

import { CLIENT_ID } from "../../common/constants";
import { Login } from "../../modules/Login/Login";
const LazyApp = lazy(() => import("./App"));

const Bootstrap = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Login />;
	}
	return (
		<Suspense fallback={<div />}>
			<LazyApp />
		</Suspense>
	);
};

export const AppBootstrap = () => {
	return (
		<>
			<AuthProvider clientId={CLIENT_ID}>
				<Bootstrap />
			</AuthProvider>
		</>
	);
};
