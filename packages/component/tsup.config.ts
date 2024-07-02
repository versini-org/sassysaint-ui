import { defineConfig } from "tsup";

export default defineConfig({
	format: "esm",
	entry: {
		index: "src/components/index.ts",
	},
	outDir: "dist",
	dts: {
		only: true,
	},
});
