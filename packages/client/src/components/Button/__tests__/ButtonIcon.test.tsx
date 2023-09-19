import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ButtonIcon } from "../..";

describe("ButtonIcon (exceptions)", () => {
	it("should be able to require/import from root", () => {
		expect(ButtonIcon).toBeDefined();
	});
});

describe("ButtonIcon with a tooltip", () => {
	it("should render a default button", async () => {
		const user = userEvent.setup();

		render(<ButtonIcon label="Close">hello</ButtonIcon>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("p-2");
		await user.hover(button);

		await screen.findByText("Close");
		expect(button).toHaveAttribute("aria-describedby");
	});
});

describe("ButtonIcon modifiers", () => {
	it("should render a default button", async () => {
		render(<ButtonIcon>hello</ButtonIcon>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("p-2");
	});

	it("should render a dark button", async () => {
		render(<ButtonIcon kind="dark">hello</ButtonIcon>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("text-slate-200 bg-slate-900");
	});

	it("should render a light button", async () => {
		render(<ButtonIcon kind="light">hello</ButtonIcon>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("text-slate-200 bg-slate-500");
	});

	it("should render a disabled dark button", async () => {
		render(
			<ButtonIcon kind="dark" disabled>
				hello
			</ButtonIcon>,
		);
		const button = await screen.findByRole("button");
		expect(button.className).toContain(
			"disabled:opacity-50 disabled:cursor-not-allowed",
		);
	});

	it("should render a disabled light button", async () => {
		render(
			<ButtonIcon kind="light" disabled>
				hello
			</ButtonIcon>,
		);
		const button = await screen.findByRole("button");
		expect(button.className).toContain(
			"disabled:opacity-50 disabled:cursor-not-allowed",
		);
	});

	it("should render a fullWidth button", async () => {
		render(<ButtonIcon fullWidth>hello</ButtonIcon>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("w-full");
	});
});
