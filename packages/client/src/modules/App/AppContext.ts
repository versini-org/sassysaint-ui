import React from "react";

import { MODEL_GPT4 } from "../../common/constants";
import type { AppContextProps } from "../../common/types";

export const AppContext = React.createContext<AppContextProps>({
	state: { id: "", model: MODEL_GPT4, usage: 0, messages: [] },
	dispatch: () => {},
});

export const HistoryContext = React.createContext<any>({
	state: { searchString: "", sortedCell: "", sortDirection: "" },
	dispatch: () => {},
});
