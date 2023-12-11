import { useAuth0 } from "@auth0/auth0-react";
import { Footer, Main } from "@versini/ui-components";
import { useEffect, useReducer, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	DEFAULT_MODEL,
	LOCAL_STORAGE_MODEL,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { APP_NAME, APP_OWNER, POWERED_BY } from "../../common/strings";
import {
	getCurrentGeoLocation,
	isDev,
	serviceCall,
} from "../../common/utilities";
import { MessagesContainer } from "..";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const { isLoading, isAuthenticated } = useAuth0();
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
		/**
		 * The user is in the process of being authenticated.
		 * We cannot request for location yet, unless we are in dev mode.
		 */
		if (!isDev && (!isAuthenticated || isLoading)) {
			return;
		}

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
	}, [isAuthenticated, isLoading]);

	useEffect(() => {
		/**
		 * Basic location is not available yet.
		 * We cannot request for detailed location yet.
		 */
		if (!state.location) {
			return;
		}

		/**
		 * We already have the detailed location.
		 * We do not need to request it again.
		 */
		if (state.location.city) {
			return;
		}

		(async () => {
			try {
				const response = await serviceCall({
					name: "location",
					data: {
						location: locationRef.current,
					},
				});

				if (response.status === 200) {
					const data = await response.json();
					dispatch({
						type: ACTION_LOCATION,
						payload: {
							location: {
								...locationRef.current,
								city: data?.address?.City,
								region: data?.address?.Region,
								regionShort: data?.address?.RegionAbbr,
								country: data?.address?.CntryName,
								countryShort: data?.address?.CountryCode,
							},
						},
					});
				}
			} catch (error) {
				// nothing to declare officer
			}
		})();
	}, [state]);

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

	const buildClass = isDev ? "text-red-900" : "text-slate-300";

	return isLoading && !isDev ? null : (
		<AppContext.Provider value={{ state, dispatch }}>
			<Main>
				<MessagesContainer />
			</Main>
			<Footer
				kind="light"
				row1={
					<>
						<div>
							{APP_NAME} v{import.meta.env.BUILDVERSION} - {POWERED_BY}
						</div>
					</>
				}
				row2={
					<div className={buildClass}>
						&copy; {new Date().getFullYear()} {APP_OWNER}
					</div>
				}
			/>
		</AppContext.Provider>
	);
}

export default App;
