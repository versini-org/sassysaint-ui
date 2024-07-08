import "../../index.css";

import { AuthProvider, useAuth } from "@versini/auth-provider";
import { Suspense, lazy } from "react";

import { CLIENT_ID } from "../../common/constants";
import { DOMAIN } from "../../common/utilities";
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
	domain = DOMAIN,
}: { isComponent: boolean; domain: string }) => {
	return (
		<>
			<AuthProvider clientId={CLIENT_ID} domain={domain}>
				<Bootstrap isComponent={isComponent} />
			</AuthProvider>
		</>
	);
};
