import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useReducer, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	DEFAULT_MODEL,
	LOCAL_STORAGE_MODEL,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { getCurrentGeoLocation, isDev } from "../../common/utilities";
import { Footer, Main, MessagesContainer } from "../../components";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const { isLoading } = useAuth0();
	const storage = useLocalStorage();
	const model = storage.get(LOCAL_STORAGE_MODEL)?.toString() || DEFAULT_MODEL;

	const locationRef = useRef({
		latitude: 0,
		longitude: 0,
		accuracy: 0,
	});
	const [state, dispatch] = useReducer(reducer, {
		id: uuidv4(),
		model,
		usage: 0,
		messages: [],
	});

	useEffect(() => {
		if (!locationRef.current || locationRef.current.accuracy === 0) {
			(async () => {
				locationRef.current = await getCurrentGeoLocation();
				dispatch({
					type: ACTION_LOCATION,
					payload: {
						location: locationRef.current,
					},
				});
			})();
		}
	}, []);

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
			<Footer poweredBy={state.model} />
		</AppContext.Provider>
	);
}

export default App;
