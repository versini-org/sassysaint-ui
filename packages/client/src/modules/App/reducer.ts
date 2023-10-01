import { v4 as uuidv4 } from "uuid";

import {
	ACTION_LOCATION,
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
} from "../../common/constants";
import { ActionProps, StateProps } from "../../common/types";

export const reducer = (state: StateProps, action: ActionProps) => {
	console.log("==> state: ", state);

	if (action?.type === ACTION_RESTORE) {
		const messages = action.payload.messages.map((item: any) => {
			return {
				message: {
					role: item.role,
					content: item.content,
					name: item.name,
				},
			};
		});
		return {
			id: action.payload.id,
			model: action.payload.model,
			usage: action.payload.usage,
			location: state.location,
			messages,
		};
	}

	if (action?.type === ACTION_MESSAGE) {
		const role = action.payload.message.role;
		const content = action.payload.message.content;
		const name = action.payload.message.name;

		if (role !== "" && content !== "") {
			const message =
				name && name !== ""
					? {
							role,
							content,
							name,
					  }
					: {
							role,
							content,
					  };

			return {
				id: state.id,
				model: state.model,
				usage: state.usage,
				location: state.location,
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
			usage: 0,
			messages: [],
			location: state.location,
		};
	}

	if (action?.type === ACTION_MODEL) {
		return {
			id: state.id,
			model: action.payload.model,
			usage: action.payload.usage,
			messages: state.messages,
			location: state.location,
		};
	}

	if (action?.type === ACTION_LOCATION) {
		return {
			id: state.id,
			model: state.model,
			usage: state.usage,
			messages: state.messages,
			location: action.payload.location,
		};
	}

	return state;
};
