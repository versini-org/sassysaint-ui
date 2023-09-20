import { render, screen } from "@testing-library/react";

import { Card } from "../..";

describe("Card (exceptions)", () => {
	it("should be able to require/import from root", () => {
		expect(Card).toBeDefined();
	});
});

describe("Card modifiers", () => {
	it("should render a default card", async () => {
		const { container } = render(<Card />);
		const card = container.children[0];

		expect(card.className).toContain("p-4");
		expect(card.className).toContain("rounded-md");
		expect(card.className).toContain("text-slate-200");
	});

	it("should render a card with a title", async () => {
		render(<Card title="hello" />);
		const card = await screen.findByText("hello");
		expect(card).toBeDefined();
	});

	it("should render a card with a subTitle", async () => {
		render(<Card subTitle="hello" />);
		const card = await screen.findByText("hello");
		expect(card).toBeDefined();
	});

	it("should render a card with raw data", async () => {
		render(<Card rawData={<p>hello</p>} />);
		const card = await screen.findByText("hello");
		expect(card).toBeDefined();
	});

	it("should render a card with non-raw data", async () => {
		render(
			<Card
				data={{
					hello: "world",
				}}
			/>,
		);
		const card = await screen.findByText("hello");
		expect(card).toBeDefined();
	});
});
