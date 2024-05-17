import { useAuth0 } from "@auth0/auth0-react";
import { Button, Main } from "@versini/ui-components";
import { useEffect } from "react";
import { LOG_IN } from "../../common/strings";
import { getMessageContaintWrapperClass } from "../../common/utilities";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainerHeader } from "../Messages/MessagesContainerHeader";

export const Login = () => {
	const { loginWithRedirect, isLoading } = useAuth0();

	useEffect(() => {
		if (isLoading) {
			return;
		}
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	}, [isLoading]);

	return (
		<>
			<Main>
				<div className={getMessageContaintWrapperClass()}>
					<MessagesContainerHeader />
				</div>
				<Button
					mode="dark"
					focusMode="light"
					noBorder
					className="mb-4 mt-6"
					onClick={() => loginWithRedirect()}
				>
					{LOG_IN}
				</Button>
			</Main>
			<AppFooter />
		</>
	);
};
