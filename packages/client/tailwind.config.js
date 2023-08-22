/** @type {import('tailwindcss').Config} */

import typography from "@tailwindcss/typography";
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// darkMode: "class",
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						blockquote: {
							borderLeftColor: "var(--tw-prose-blockquote-border-color)",
						},
						"ul > li::marker": {
							color: "var(--tw-prose-counter)",
						},
					},
				},
			},
		},
	},
	plugins: [typography],
};
