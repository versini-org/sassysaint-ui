import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	source: {
		entry: {
			index: "./src/main.tsx",
		},
	},
	output: {
		distPath: {
			root: "./build",
		},
	},
	html: {
		template: "./index.html",
	},
	plugins: [pluginReact()],
});
