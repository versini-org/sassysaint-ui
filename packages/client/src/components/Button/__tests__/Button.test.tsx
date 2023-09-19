import { render, screen } from "@testing-library/react";

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
		expect(button.className).toContain("text-slate-200 bg-slate-900");
	});

	it("should render a light button", async () => {
		render(<Button kind="light">hello</Button>);
		const button = await screen.findByRole("button");
		expect(button.className).toContain("text-slate-200 bg-slate-500");
	});

	it("should render a disabled dark button", async () => {
		render(
			<Button kind="dark" disabled>
				hello
			</Button>,
		);
		const button = await screen.findByRole("button");
		expect(button.className).toContain(
			"disabled:opacity-50 disabled:cursor-not-allowed",
		);
	});

	it("should render a disabled light button", async () => {
		render(
			<Button kind="light" disabled>
				hello
			</Button>,
		);
		const button = await screen.findByRole("button");
		expect(button.className).toContain(
			"disabled:opacity-50 disabled:cursor-not-allowed",
		);
	});
});
