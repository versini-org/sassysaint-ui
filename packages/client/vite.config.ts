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

let counter = 0;

export default defineConfig({
	build: {
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			output: {
				/**
				 * Manually naming chunks in case of "index" so that
				 * the bundlesize process can figure out the difference
				 * between index-123.js and index0-123.js.
				 */

				chunkFileNames(chunkInfo) {
					if (chunkInfo.name === "index") {
						return `assets/${chunkInfo.name}${counter++}-[hash].js`;
					}
					return `assets/${chunkInfo.name}-[hash].js`;
				},
			},
		},
	},
	esbuild: {
		supported: {
			"top-level-await": true, //browsers can handle top-level-await features
		},
	},
	define: {
		"import.meta.env.BUILDTIME": JSON.stringify(buildTime),
		"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
	},
	plugins: [],
});
