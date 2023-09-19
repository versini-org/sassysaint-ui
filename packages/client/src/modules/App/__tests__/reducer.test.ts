import { describe, expect, it, vi } from "vitest";

import {
	ACTION_LOCATION,
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
			};
			expect(reducer(state, undefined)).toEqual(state);
		});

		it("should return the payload state on ACTION_RESTORE", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [],
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
				location: state.location,
				messages: [
					{
						message: actionPayload.messages[0],
					},
				],
			});
		});

		it("should return a reset state on ACTION_RESET", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [],
			};
			expect(
				reducer(state, {
					type: ACTION_RESET,
				}),
			).toEqual({
				id: MOCK_UUIDV4,
				model: state.model,
				usage: 0,
				location: state.location,
				messages: [],
			});
		});

		it("should return a new model state on ACTION_MODEL", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [],
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
				location: state.location,
				messages: state.messages,
			});
		});

		it("should return a new location state on ACTION_LOCATION", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [],
			};
			const actionPayload = {
				location: {
					latitude: 2,
					longitude: 2,
					accuracy: 2,
				},
			};
			expect(
				reducer(state, {
					type: ACTION_LOCATION,
					payload: actionPayload,
				}),
			).toEqual({
				id: state.id,
				location: actionPayload.location,
				messages: state.messages,
				model: state.model,
				usage: state.usage,
			});
		});

		it("should augment the existing messages state on ACTION_MESSAGE with a name", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [
					{
						message: {
							role: "bot666",
							content: "Hello666",
							name: "GPT-666",
						},
					},
				],
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
				location: state.location,
				messages: [
					...state.messages,
					{
						message: actionPayload.message,
					},
				],
			});
		});

		it("should augment the existing messages state on ACTION_MESSAGE without a name", () => {
			const state = {
				id: "123",
				model: "gpt-666",
				usage: 456,
				location: {
					latitude: 1,
					longitude: 1,
					accuracy: 1,
				},
				messages: [
					{
						message: {
							role: "bot666",
							content: "Hello666",
							name: "GPT-666",
						},
					},
				],
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
				location: state.location,
				messages: [
					...state.messages,
					{
						message: actionPayload.message,
					},
				],
			});
		});
	});
});
