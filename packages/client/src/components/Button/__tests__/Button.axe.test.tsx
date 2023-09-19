import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Button } from "../..";

describe("when testing for a11y violations via Axe", () => {
	it("should not raise any a11y violations", async () => {
		const { container } = render(<Button>hello</Button>);
		const result = await axe(container.innerHTML, {
			rules: {
				/**
				 * All page content must be contained by landmarks.
				 * This does not really make sense when testing
				 * individual components.
				 */
				region: {
					enabled: false,
				},
			},
		});
		expect(result).toHaveNoViolations();
	});
});
