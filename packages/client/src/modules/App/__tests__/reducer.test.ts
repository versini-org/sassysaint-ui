import { describe, expect, it, vi } from "vitest";

import {
	ACTION_MESSAGE,
	ACTION_MODEL,
	ACTION_RESET,
	ACTION_RESTORE,
} from "../../../common/constants";
import { reducer } from "../reducer";

const MOCK_UUIDV4 = "123456-7890-1234567890";

vi.mock("uuid", async () => {
	return {
		v4: () => MOCK_UUIDV4,
	};
});

describe("Non-DOM tests", () => {
	describe("reducer tests", () => {
		it("should return the initial state", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [],
				isComponent: false,
			};
			expect(reducer(state, undefined)).toEqual(state);
		});

		it("should return the payload state on ACTION_RESTORE", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [],
				isComponent: false,
			};
			const actionPayload = {
				id: "123456",
				model: "gpt-777",
				usage: 456789,
				messages: [
					{
						role: "bot777",
						content: "Hello777",
						name: "GPT-777",
					},
				],
			};
			expect(
				reducer(state, {
					type: ACTION_RESTORE,
					payload: actionPayload,
				}),
			).toEqual({
				id: actionPayload.id,
				model: actionPayload.model,
				usage: actionPayload.usage,
				messages: [
					{
						message: actionPayload.messages[0],
					},
				],
				isComponent: state.isComponent,
			});
		});

		it("should return a reset state on ACTION_RESET", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [],
				isComponent: false,
			};
			expect(
				reducer(state, {
					type: ACTION_RESET,
				}),
			).toEqual({
				id: MOCK_UUIDV4,
				model: state.model,
				usage: 0,
				messages: [],
				isComponent: state.isComponent,
			});
		});

		it("should return a new model state on ACTION_MODEL", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [],
				isComponent: false,
			};
			const actionPayload = {
				model: "gpt-777",
				usage: 456789,
			};
			expect(
				reducer(state, {
					type: ACTION_MODEL,
					payload: actionPayload,
				}),
			).toEqual({
				id: state.id,
				model: actionPayload.model,
				usage: actionPayload.usage,
				messages: state.messages,
				isComponent: state.isComponent,
			});
		});

		it("should augment the existing messages state on ACTION_MESSAGE with a name", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [
					{
						message: {
							role: "bot666",
							content: "Hello666",
							name: "GPT-666",
						},
					},
				],
				isComponent: false,
			};
			const actionPayload = {
				message: {
					role: "bot777",
					content: "Hello777",
					name: "GPT-777",
				},
			};
			expect(
				reducer(state, {
					type: ACTION_MESSAGE,
					payload: actionPayload,
				}),
			).toEqual({
				id: state.id,
				model: state.model,
				usage: state.usage,
				messages: [
					...state.messages,
					{
						message: actionPayload.message,
					},
				],
				isComponent: state.isComponent,
			});
		});

		it("should augment the existing messages state on ACTION_MESSAGE without a name", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				messages: [
					{
						message: {
							role: "bot666",
							content: "Hello666",
							name: "GPT-666",
						},
					},
				],
				isComponent: false,
			};
			const actionPayload = {
				message: {
					role: "bot777",
					content: "Hello777",
				},
			};
			expect(
				reducer(state, {
					type: ACTION_MESSAGE,
					payload: actionPayload,
				}),
			).toEqual({
				id: state.id,
				model: state.model,
				usage: state.usage,
				messages: [
					...state.messages,
					{
						message: actionPayload.message,
					},
				],
				isComponent: state.isComponent,
			});
		});
	});
});
