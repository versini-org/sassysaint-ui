/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "../..";

describe("Button (exceptions)", () => {
	it("should be able to require/import from root", () => {
		expect(Button).toBeDefined();
	});
});

describe("Button modifiers", () => {
	it("should render a default button", async () => {
		render(<Button>hello</Button>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("py-2");
	});

	it("should render a slim button", async () => {
		render(<Button slim>hello</Button>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("py-1");
	});

	it("should render a dark button", async () => {
		render(<Button kind="dark">hello</Button>);
		const button = await screen.findByRole("button");
		const buttonClass = button.className;
		expect(buttonClass).toContain("text-slate-200");
		expect(buttonClass).toContain("bg-slate-900");
	});

	it("should render a light button", async () => {
		render(<Button kind="light">hello</Button>);
		const button = await screen.findByRole("button");
		const buttonClass = button.className;
		expect(buttonClass).toContain("text-slate-200");
		expect(buttonClass).toContain("bg-slate-500");
	});

	it("should render a disabled dark button", async () => {
		render(
			<Button kind="dark" disabled>
				hello
			</Button>,
		);
		const button = await screen.findByRole("button");
		const buttonClass = button.className;
		expect(buttonClass).toContain("disabled:opacity-50");
		expect(buttonClass).toContain("disabled:cursor-not-allowed");
	});

	it("should render a disabled light button", async () => {
		render(
			<Button kind="light" disabled>
				hello
			</Button>,
		);
		const button = await screen.findByRole("button");
		const buttonClass = button.className;
		expect(buttonClass).toContain("disabled:opacity-50");
		expect(buttonClass).toContain("disabled:cursor-not-allowed");
	});

	it("should render a fullWidth button", async () => {
		render(<Button fullWidth>hello</Button>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("w-full");
	});
});

describe("Button methods", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should honor the onClick prop", async () => {
		const events = {
			onClick: () => {},
		};
		const spyOnClick = vi.spyOn(events, "onClick");
		const user = userEvent.setup();

		// @ts-ignore
		render(<Button onClick={spyOnClick}>hello</Button>);
		const button = await screen.findByRole("button");
		await user.click(button);
		await user.click(button);

		expect(spyOnClick).toHaveBeenCalledTimes(2);
	});

	it("should implement a focus method via the ref prop", () => {
		const buttonRef = (ref: HTMLButtonElement) => {
			if (ref) {
				expect(ref.focus).toBeDefined();
			}
		};
		render(<Button ref={buttonRef}>Button</Button>);
	});
});
