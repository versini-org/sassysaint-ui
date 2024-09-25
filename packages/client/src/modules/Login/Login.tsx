import { useAuth } from "@versini/auth-provider";
import { Button, ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import { IconHide, IconPasskey, IconShow } from "@versini/ui-icons";
import { Main } from "@versini/ui-main";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { TextInput, TextInputMask } from "@versini/ui-textinput";
import { useEffect, useState } from "react";

import {
	LOG_IN,
	LOG_IN_PASSKEY,
	PASSWORD_PLACEHOLDER,
} from "../../common/strings";
import { getMessageContaintWrapperClass } from "../../common/utilities";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainerHeader } from "../Messages/MessagesContainerHeader";

export const Login = () => {
	const { login, logoutReason, loginWithPasskey } = useAuth();

	const [errorMessage, setErrorMessage] = useState("");
	const [globalErrorMessage, setGlobalErrorMessage] = useState("");
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const response = await login(simpleLogin.username, simpleLogin.password);
		if (!response) {
			setGlobalErrorMessage("");
			setErrorMessage("Invalid username or password");
		}
	};

	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	useEffect(() => {
		if (logoutReason) {
			setGlobalErrorMessage(logoutReason);
		}
	}, [logoutReason]);

	return (
		<>
			<Main>
				<div className={getMessageContaintWrapperClass()}>
					<MessagesContainerHeader />
				</div>
				<form className="mt-5" onSubmit={handleLogin}>
					<Flexgrid alignHorizontal="center" rowGap={7}>
						<FlexgridItem span={6}>
							<Card mode="dark">
								<FlexgridItem span={12}>
									{globalErrorMessage && (
										<div className="p-2 text-sm text-center text-copy-error-light bg-surface-darker">
											{globalErrorMessage}
										</div>
									)}
								</FlexgridItem>

								<FlexgridItem span={12}>
									<TextInput
										required
										autoCapitalize="off"
										autoComplete="off"
										autoCorrect="off"
										mode="dark"
										focusMode="light"
										name="username"
										label="Username"
										onChange={(e) => {
											setSimpleLogin({
												...simpleLogin,
												username: e.target.value,
											});
											setErrorMessage("");
										}}
										error={errorMessage !== ""}
									/>
								</FlexgridItem>
								<FlexgridItem span={12}>
									<TextInputMask
										required
										autoCapitalize="off"
										autoComplete="off"
										autoCorrect="off"
										mode="dark"
										focusMode="light"
										name="password"
										label={PASSWORD_PLACEHOLDER}
										rightElement={
											<ButtonIcon focusMode="light" mode="dark">
												{masked ? <IconShow /> : <IconHide />}
											</ButtonIcon>
										}
										onMaskChange={setMasked}
										onChange={(e) => {
											setSimpleLogin({
												...simpleLogin,
												password: e.target.value,
											});
											setErrorMessage("");
										}}
										error={errorMessage !== ""}
										helperText={errorMessage}
									/>
								</FlexgridItem>

								<FlexgridItem span={12}>
									<Button
										mode="light"
										focusMode="light"
										fullWidth
										noBorder
										type="submit"
										className="mb-4 mt-6"
									>
										{LOG_IN}
									</Button>
								</FlexgridItem>
							</Card>
						</FlexgridItem>
					</Flexgrid>

					<div className="text-center text-copy-light">or</div>
					<Flexgrid alignHorizontal="center">
						<FlexgridItem span={6}>
							<ButtonIcon
								mode="dark"
								focusMode="light"
								fullWidth
								noBorder
								className="mb-4 mt-1"
								labelRight={LOG_IN_PASSKEY}
								onClick={loginWithPasskey}
							>
								<IconPasskey className="size-7" />
							</ButtonIcon>
						</FlexgridItem>
					</Flexgrid>
				</form>
			</Main>
			<AppFooter />
		</>
	);
};
