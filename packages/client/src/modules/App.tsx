import { useAuth0 } from "@auth0/auth0-react";
import { useReducer } from "react";

import { ACTION, DEFAULT_MODEL } from "../common/constants";
import { isDev, retrieveModel } from "../common/utilities";
import { Footer, Main, MessagesContainer } from "../components";
import { AppContext } from "./AppContext";
import { ActionProps, StateProps } from "./AppTypes";

const reducer = (state: StateProps, action: ActionProps) => {
	if (action.type === ACTION.MESSAGE) {
		const role = action.payload?.message?.role;
		const content = action.payload?.message?.content;
		if (role !== "" && content !== "") {
			return {
				model: state.model,
				usage: state.usage,
				messages: [
					...state.messages,
					{
						message: {
							role,
							content,
						},
					},
				],
			};
		}
	}

	if (action.type === ACTION.RESET) {
		return {
			model: DEFAULT_MODEL,
			usage: 0,
			messages: [],
		};
	}

	if (action.type === ACTION.MODEL) {
		return {
			model: action.payload?.model || state.model,
			usage: action.payload?.usage || state.usage,
			messages: state.messages,
		};
	}

	return state;
};

function App() {
	const { isLoading } = useAuth0();
	const model = retrieveModel() || DEFAULT_MODEL;
	const [state, dispatch] = useReducer(reducer, {
		model,
		usage: 0,
		messages: [],
	});

	return isLoading && !isDev ? null : (
		<div className="fade">
			<AppContext.Provider value={{ state, dispatch }}>
				<Main>
					<MessagesContainer />
				</Main>
				<Footer />
			</AppContext.Provider>
		</div>
	);
}

export default App;
