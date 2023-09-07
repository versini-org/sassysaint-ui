import React from "react";

import { DEFAULT_MODEL } from "../common/constants";
import type { AppContextProps } from "./AppTypes";

export const AppContext = React.createContext<AppContextProps>({
	state: { model: DEFAULT_MODEL, usage: 0, messages: [] },
	dispatch: () => {},
});
