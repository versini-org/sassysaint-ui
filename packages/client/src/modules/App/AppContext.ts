import React from "react";

import { DEFAULT_MODEL } from "../../common/constants";
import type { AppContextProps } from "../../common/types";

export const AppContext = React.createContext<AppContextProps>({
	state: { id: "", model: DEFAULT_MODEL, usage: 0, messages: [] },
	dispatch: () => {},
});

export const HistoryContext = React.createContext<any>({
	state: { searchString: "" },
	dispatch: () => {},
});
