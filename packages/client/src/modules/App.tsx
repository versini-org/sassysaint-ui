import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
	DEFAULT_MODEL,
} from "../common/constants";
import { isDev, retrieveModel } from "../common/utilities";
import { Footer, Main, MessagesContainer } from "../components";
import { AppContext } from "./AppContext";
import { ActionProps, StateProps } from "./AppTypes";

const reducer = (state: StateProps, action: ActionProps) => {
	if (action.type === ACTION_RESTORE) {
		const messages = action.payload.messages.map((item: any) => {
			return {
				message: {
					role: item.role,
					content: item.content,
					name: item.name,
				},
			};
		});
		return {
			id: action.payload.id,
			model: action.payload.model,
			usage: action.payload.usage,
			messages,
		};
	}

	if (action.type === ACTION_MESSAGE) {
		const role = action.payload.message.role;
		const content = action.payload.message.content;
		const name = action.payload.message.name;

		if (role !== "" && content !== "") {
			const message =
				name && name !== ""
					? {
							role,
							content,
							name,
					  }
					: {
							role,
							content,
					  };

			return {
				id: state.id,
				model: state.model,
				usage: state.usage,
				messages: [
					...state.messages,
					{
						message,
					},
				],
			};
		}
	}

	if (action.type === ACTION_RESET) {
		return {
			id: uuidv4(),
			model: state.model || DEFAULT_MODEL,
			usage: 0,
			messages: [],
		};
	}

	if (action.type === ACTION_MODEL) {
		return {
			id: state.id,
			model: action.payload.model || state.model,
			usage: action.payload.usage || state.usage,
			messages: state.messages,
		};
	}

	return state;
};

function App() {
	const { isLoading } = useAuth0();
	const model = retrieveModel() || DEFAULT_MODEL;
	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model,
		usage: 0,
		messages: [],
	});

	useEffect(() => {
		if (isLoading && !isDev) {
			return;
		}
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	}, [isLoading]);

	return isLoading && !isDev ? null : (
		<AppContext.Provider value={{ state, dispatch }}>
			<Main>
				<MessagesContainer />
			</Main>
			<Footer />
		</AppContext.Provider>
	);
}

export default App;
