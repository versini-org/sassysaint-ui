import React from "react";

import { DEFAULT_AI_ENGINE } from "../../common/constants";
import type { AppContextProps } from "../../common/types";

export const AppContext = React.createContext<AppContextProps>({
	state: {
		id: "",
		model: DEFAULT_AI_ENGINE,
		engine: DEFAULT_AI_ENGINE,
		usage: 0,
		messages: [],
		isComponent: false,
	},
	dispatch: () => {},
	serverStats: {
		version: "",
		models: [],
		plugins: [],
		engine: DEFAULT_AI_ENGINE,
	},
});

export const HistoryContext = React.createContext<any>({
	state: { searchString: "", sortedCell: "", sortDirection: "" },
	dispatch: () => {},
});

export const TagsContext = React.createContext<any>({
	state: { tag: "" },
	dispatch: () => {},
});
