/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	{},
	defineConfig({
		test: {
			globals: true,
			setupFiles: ["./vitest.setup.ts"],
			environment: "happy-dom",
			coverage: {
				include: ["src/**/*.ts", "src/**/*.tsx"],
				provider: "v8",
				thresholds: {
					lines: 15,
					functions: 30,
					statements: 15,
					branches: 65,
				},
			},
		},
	}),
);
