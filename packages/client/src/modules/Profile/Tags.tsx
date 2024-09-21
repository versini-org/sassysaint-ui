import { useAuth } from "@versini/auth-provider";
import { Card, Panel } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";
import { useEffect, useState } from "react";

import { useLocalStorage } from "@versini/ui-hooks";
import { LOCAL_STORAGE_PREFIX } from "../../common/constants";
import { SERVICE_TYPES, serviceCall } from "../../common/services";

export const TagsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const [showSummarizeArticle, setShowSummarizeArticle] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + "summarize-article",
		initialValue: false,
	});
	const { getAccessToken, user } = useAuth();
	const [customInstructions, setCustomInstructions] = useState({
		loaded: false,
		content: "",
		loadingLocation: false,
		location: "",
	});

	/**
	 * Effect to fetch the custom instructions (including custom location)
	 * from the server.
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: getAccessToken is stable
	useEffect(() => {
		if (!open || !user) {
			/**
			 * Panel is closed, no pre-fetching
			 */
			setCustomInstructions({
				loaded: false,
				loadingLocation: false,
				content: "",
				location: "",
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
					setCustomInstructions((prev) => ({
						...prev,
						loaded: true,
						content: response.data.instructions,
						location: response.data.location,
					}));
				}
			} catch (_error) {
				// nothing to declare officer
			}
		})();
	}, [user, open]);

	const onToggleSummarizeArticle = (checked: boolean) => {
		setShowSummarizeArticle(checked);
	};

	return (
		<>
			{customInstructions.loaded && (
				<Panel open={open} onOpenChange={onOpenChange} title={"Tags"}>
					<Card
						header={"Pre-filled Tags"}
						className="prose-dark dark:prose-lighter"
					>
						<p>
							Tags are pre-filled buttons available on the main screen, to help
							you quickly start requests.
						</p>
						<Toggle
							noBorder
							label={"Summarize Article"}
							name={"summarize-article"}
							onChange={onToggleSummarizeArticle}
							checked={showSummarizeArticle}
						/>
					</Card>
				</Panel>
			)}
		</>
	);
};
