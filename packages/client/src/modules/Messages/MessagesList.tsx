import { Bubble } from "@versini/ui-bubble";
import { Truncate } from "@versini/ui-truncate";
import { Suspense, lazy, useContext } from "react";

import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

const LazyMessageAssistant = lazy(
	() =>
		import(
			/* webpackChunkName: "LazyMessageAssistant" */ "./LazyMessageAssistant"
		),
);

export const MessagesList = () => {
	const { state } = useContext(AppContext);

	return (
		<div className="space-y-6 mt-2">
			{state &&
				state.messages.length > 0 &&
				state.messages.map((data, index) => {
					const { role, content, name, processingTime } = data.message;
					if ((role === ROLE_ASSISTANT || role === ROLE_INTERNAL) && content) {
						return (
							<Suspense key={`${index}-${role}`} fallback={<span></span>}>
								<LazyMessageAssistant
									name={name}
									processingTime={processingTime}
								>
									{content}
								</LazyMessageAssistant>
							</Suspense>
						);
					}
					if (role === ROLE_USER && content) {
						return (
							<Bubble
								kind="right"
								key={`${index}-${role}`}
								copyToClipboard={content}
								copyToClipboardFocusMode="light"
							>
								<Truncate mode="light" focusMode="light">
									{content}
								</Truncate>
							</Bubble>
						);
					}
					return null;
				})}

			{isLastMessageFromRole(ROLE_USER, state) && (
				<Suspense fallback={<span></span>}>
					<LazyMessageAssistant loading />
				</Suspense>
			)}
		</div>
	);
};
