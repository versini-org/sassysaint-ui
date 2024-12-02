import {
	ACTION_RESET_TAGS,
	ACTION_SET_TAGS,
	ACTION_TOGGLE_TAG,
} from "../constants";
import type { ActionTagsProps, StateTagsProps } from "../types";

export const tagsReducer = (state: StateTagsProps, action: ActionTagsProps) => {
	switch (action?.type) {
		case ACTION_TOGGLE_TAG:
			return {
				tags: state.tags,
				tag: action.payload.tag,
			};
		case ACTION_RESET_TAGS:
			return {
				tags: state.tags,
				tag: "",
			};
		case ACTION_SET_TAGS:
			return {
				tags: action.payload.tags,
				tag: "",
			};

		default:
			return state;
	}
};
