import { AUTH_TYPES, useAuth } from "@versini/auth-provider";
import { Button, ButtonIcon, Main } from "@versini/ui-components";
import { TextInput, TextInputMask } from "@versini/ui-form";
import { IconHide, IconShow } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useEffect, useState } from "react";

import { LOG_IN, PASSWORD_PLACEHOLDER } from "../../common/strings";
import { getMessageContaintWrapperClass } from "../../common/utilities";
import { AppFooter } from "../Footer/AppFooter";
import { MessagesContainerHeader } from "../Messages/MessagesContainerHeader";

export const Login = () => {
	const { login, logoutReason } = useAuth();

	const [errorMessage, setErrorMessage] = useState("");
	const [globalErrorMessage, setGlobalErrorMessage] = useState("");
	const [masked, setMasked] = useState(true);
	const [simpleLogin, setSimpleLogin] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const response = await login(
			simpleLogin.username,
			simpleLogin.password,
			AUTH_TYPES.CODE,
		);
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
				<form className="mx-auto mt-5" onSubmit={handleLogin}>
					<Flexgrid rowGap={7} width="350px">
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
									<ButtonIcon focusMode="light">
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
								focusMode="light"
								fullWidth
								noBorder
								type="submit"
								className="mb-4 mt-6"
							>
								{LOG_IN}
							</Button>
						</FlexgridItem>
					</Flexgrid>
				</form>
			</Main>
			<AppFooter />
		</>
	);
};
