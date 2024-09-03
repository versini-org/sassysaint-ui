import { useAuth } from "@versini/auth-provider";
import { Button, Panel } from "@versini/ui-components";
import { TextArea } from "@versini/ui-form";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useEffect, useState } from "react";

import { SERVICE_TYPES, serviceCall } from "../../common/services";

export const CustomInstructionsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const { getAccessToken, user } = useAuth();
	const [customInstructions, setCustomInstructions] = useState({
		loaded: false,
		content: "",
	});

	const onSave = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			await serviceCall({
				accessToken: await getAccessToken(),
				type: SERVICE_TYPES.SET_CUSTOM_INSTRUCTIONS,
				params: {
					user: user?.username,
					instructions: customInstructions.content,
				},
			});
		} catch (_error) {
			// nothing to declare officer
		}
	};

	useEffect(() => {
		if (!open || !user) {
			/**
			 * Panel is closed, no pre-fetching
			 */
			setCustomInstructions({
				loaded: false,
				content: "",
			});
			return;
		}
		(async () => {
			try {
				const response = await serviceCall({
					accessToken: await getAccessToken(),
					type: SERVICE_TYPES.GET_CUSTOM_INSTRUCTIONS,
					params: {
						user: user.username,
					},
				});

				if (response.status === 200) {
					setCustomInstructions({
						loaded: true,
						content: response.data,
					});
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [getAccessToken, user, open]);

	return (
		<>
			{customInstructions.loaded && (
				<Panel
					open={open}
					onOpenChange={onOpenChange}
					title={"Engine Fine Tuning"}
					footer={
						<Flexgrid columnGap={2} alignHorizontal="flex-end">
							<FlexgridItem>
								<Button
									mode="dark"
									variant="secondary"
									focusMode="light"
									onClick={() => {
										onOpenChange(false);
									}}
								>
									{"Cancel"}
								</Button>
							</FlexgridItem>

							<FlexgridItem>
								<Button
									mode="dark"
									variant="danger"
									focusMode="light"
									onClick={async (e) => {
										onOpenChange(false);
										await onSave(e);
									}}
								>
									{"Save"}
								</Button>
							</FlexgridItem>
						</Flexgrid>
					}
				>
					<p>
						What would you like Sassy Saint to know about you to provide better
						responses?
					</p>
					<TextArea
						mode="dark"
						focusMode="light"
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						name="customInstructions"
						label="Custom Instructions"
						defaultValue={customInstructions.content}
						onChange={(e: any) => {
							setCustomInstructions({
								loaded: true,
								content: e.target.value,
							});
						}}
						helperText="Press ENTER to add a new line."
					/>
				</Panel>
			)}
		</>
	);
};
