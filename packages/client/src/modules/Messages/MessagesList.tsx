import { Bubble } from "@versini/ui-components";
import { Suspense, lazy, useContext, useEffect, useRef } from "react";

import {
	ROLE_ASSISTANT,
	ROLE_INTERNAL,
	ROLE_USER,
} from "../../common/constants";
import { isLastMessageFromRole } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

const MessageAssistant = lazy(() => import("../Messages/MessageAssistant"));

export const MessagesList = () => {
	const { state } = useContext(AppContext);
	const smoothScrollRef: React.RefObject<HTMLDivElement> = useRef(null);

	/**
	 * if the last message is from the assistant, scroll
	 * to the top of the messages assistant container.
	 */
	useEffect(() => {
		if (!state || state.messages.length === 0) {
			return;
		}
		if (
			smoothScrollRef &&
			smoothScrollRef.current &&
			isLastMessageFromRole(ROLE_ASSISTANT, state)
		) {
			smoothScrollRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [state]);

	return (
		<>
			{state &&
				state.messages.length > 0 &&
				state.messages.map((data, index) => {
					const { role, content, name, processingTime } = data.message;
					if ((role === ROLE_ASSISTANT || role === ROLE_INTERNAL) && content) {
						return (
							<Suspense key={`${index}-${role}`} fallback={<span></span>}>
								<MessageAssistant
									smoothScrollRef={smoothScrollRef}
									name={name}
									processingTime={processingTime}
								>
									{content}
								</MessageAssistant>
							</Suspense>
						);
					}
					if (role === ROLE_USER && content) {
						return (
							<Bubble kind="right" key={`${index}-${role}`}>
								{content}
							</Bubble>
						);
					}
					return null;
				})}

			{isLastMessageFromRole(ROLE_USER, state) && (
				<Suspense fallback={<span></span>}>
					<MessageAssistant smoothScrollRef={smoothScrollRef} loading />
				</Suspense>
			)}
		</>
	);
};
