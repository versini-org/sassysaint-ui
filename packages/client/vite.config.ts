/// <reference types="vitest" />

import fs from "fs-extra";
import { defineConfig } from "vite";

const packageJson = fs.readJSONSync("package.json");

const buildTime = new Date()
	.toLocaleString("en-US", {
		timeZone: "America/New_York",
		timeZoneName: "short",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	})
	.replace(/,/g, "");

export default defineConfig({
	test: {
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		environment: "jsdom",
		coverage: {
			provider: "v8",
			lines: 55,
			functions: 30,
			branches: 100,
			statements: 55,
		},
	},
	define: {
		"import.meta.env.BUILDTIME": JSON.stringify(buildTime),
		"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
	},
	plugins: [],
});
