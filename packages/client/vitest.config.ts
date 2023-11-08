import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			setupFiles: ["./vitest.setup.ts"],
			environment: "jsdom",
			coverage: {
				provider: "v8",
				lines: 60,
				functions: 45,
				branches: 100,
				statements: 60,
			},
		},
	}),
);
