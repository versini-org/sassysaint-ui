import { v4 as uuidv4 } from "uuid";

import {
	ACTION_ENGINE,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESET_TAGS,
	ACTION_RESTORE,
	ACTION_SEARCH,
	ACTION_SORT,
	ACTION_STREAMING,
	ACTION_TOGGLE_TAG,
	ROLE_ASSISTANT,
} from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const tagsReducer = (state: any, action: any) => {
	if (action?.type === ACTION_TOGGLE_TAG) {
		return {
			tag: action.payload.tag,
		};
	}
	if (action?.type === ACTION_RESET_TAGS) {
		return {
			tag: "",
		};
	}
	return state;
};

export const historyReducer = (state: any, action: any) => {
	if (action?.type === ACTION_SEARCH) {
		return {
			searchString: action.payload.searchString,
			sortedCell: state.sortedCell,
			sortDirection: state.sortDirection,
		};
	}

	if (action?.type === ACTION_SORT) {
		return {
			searchString: state.searchString,
			sortedCell: action.payload.sortedCell,
			sortDirection: action.payload.sortDirection,
		};
	}
	return state;
};

export const reducer = (state: StateProps, action: ActionProps) => {
	if (action?.type === ACTION_RESTORE) {
		const messages = action.payload.messages.map((item: any) => {
			return {
				message: {
					role: item.role,
					content: item.content,
					name: item.name,
					processingTime: item.processingTime,
				},
			};
		});
		return {
			id: action.payload.id,
			model: action.payload.model,
			usage: action.payload.usage,
			isComponent: state.isComponent,
			messages,
			engine: state.engine,
		};
	}

	if (action?.type === ACTION_MESSAGE) {
		const role = action.payload.message.role;
		const content = action.payload.message.content;
		const name = action.payload.message.name;
		const processingTime = action.payload.message.processingTime;
		const messageId = action.payload.message.messageId;

		if (role !== "") {
			const message = {
				role,
				content,
				name,
				processingTime,
				messageId,
			};

			// need to find if a message with the same messageId already exists
			// if it exists, append the content to it, otherwise create a new message
			if (role === ROLE_ASSISTANT) {
				const index = state.messages.findIndex(
					(item) => item.message.messageId === messageId,
				);
				if (index !== -1) {
					const messages = state.messages.map((item, i) => {
						if (i === index) {
							return {
								message: {
									...item.message,
									content: `${item.message.content}${content}`,
									processingTime,
									name,
								},
							};
						}
						return item;
					});
					return {
						id: state.id,
						model: state.model,
						usage: state.usage,
						isComponent: state.isComponent,
						messages,
						engine: state.engine,
					};
				}
			}

			return {
				id: state.id,
				model: state.model,
				engine: state.engine,
				usage: state.usage,
				isComponent: state.isComponent,
				messages: [
					...state.messages,
					{
						message,
					},
				],
			};
		}
	}

	if (action?.type === ACTION_RESET) {
		return {
			id: uuidv4(),
			model: state.model,
			engine: state.engine,
			usage: 0,
			messages: [],
			isComponent: state.isComponent,
		};
	}

	if (action?.type === ACTION_MODEL) {
		return {
			id: state.id,
			model: action.payload.model,
			engine: state.engine,
			usage: action.payload.usage,
			messages: state.messages,
			isComponent: state.isComponent,
		};
	}

	if (action?.type === ACTION_ENGINE) {
		return {
			...state,
			engine: action.payload.engine,
		};
	}

	if (action?.type === ACTION_STREAMING) {
		return {
			...state,
			streaming: action.payload.streaming,
		};
	}

	return state;
};
