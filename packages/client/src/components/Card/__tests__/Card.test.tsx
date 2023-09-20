import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Card } from "../..";

describe("Card (exceptions)", () => {
	it("should be able to require/import from root", () => {
		expect(Card).toBeDefined();
	});
});

describe("Card modifiers", () => {
	it("should render a default card", async () => {
		const { container } = render(<Card />);

		expect(container.firstChild.className).toContain(
			"p-4 rounded-md text-slate-200",
		);
	});
});
