import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	source: {
		entry: {
			index: "./src/main.tsx",
		},
		define: {
			"import.meta.env.BUILDTIME": "N/A",
			"import.meta.env.BUILDVERSION": "N/A",
		},
	},
	output: {
		polyfill: "off",
		cleanDistPath: true,
		distPath: {
			root: "./dist",
		},
	},
	tools: {
		rspack: {
			optimization: {
				chunkIds: "named",
				moduleIds: "named",
			},
		},
	},
	html: {
		template: "./index.html",
	},
	server: {
		port: 5173,
	},
	plugins: [pluginReact()],
});
