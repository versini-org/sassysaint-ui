import { ACTION_SEARCH, ACTION_SORT } from "../constants";
import type { ActionHistoryProps, StateHistoryProps } from "../types";

export const historyReducer = (
	state: StateHistoryProps,
	action: ActionHistoryProps,
) => {
	switch (action?.type) {
		case ACTION_SEARCH:
			return {
				searchString: action.payload.searchString,
				sortedCell: state.sortedCell,
				sortDirection: state.sortDirection,
			};
		case ACTION_SORT:
			return {
				searchString: state.searchString,
				sortedCell: action.payload.sortedCell,
				sortDirection: action.payload.sortDirection,
			};

		default:
			return state;
	}
};
