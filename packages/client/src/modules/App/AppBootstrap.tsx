import "../../index.css";

import { AuthProvider, useAuth } from "@versini/auth-provider";
import { Suspense, lazy } from "react";

import { CLIENT_ID } from "../../common/constants";
import { Login } from "../../modules/Login/Login";
const LazyApp = lazy(() => import("./App"));

const Bootstrap = ({ isComponent }: { isComponent: boolean }) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Login />;
	}
	return (
		<Suspense fallback={<div />}>
			<LazyApp isComponent={isComponent} />
		</Suspense>
	);
};

export const AppBootstrap = ({
	isComponent = false,
}: { isComponent: boolean }) => {
	return (
		<>
			<AuthProvider clientId={CLIENT_ID}>
				<Bootstrap isComponent={isComponent} />
			</AuthProvider>
		</>
	);
};
