import fs from "fs-extra";
import { defineConfig } from "vite";

const packageJson = fs.readJSONSync("package.json");
const reactVersion = packageJson.dependencies.react;
const floatingUIVersion = packageJson.dependencies["@floating-ui/react"];

const REACT_CHUNK = "reactChunk";
const FLOATING_UI_CHUNK = "floatingUIChunk";

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
	build: {
		rollupOptions: {
			output: {
				/**
				 * Manually creating chunks for React and
				 * @floating-ui. React should be listed first, so
				 * that it does not end up in the floatingUI chunk.
				 */
				manualChunks: {
					[REACT_CHUNK]: [
						"react",
						"react/jsx-runtime",
						"react-dom",
						"react-dom/server",
					],
					[FLOATING_UI_CHUNK]: ["@floating-ui/react"],
				},
				/**
				 * By default, manual chucks (created above), will
				 * have a hash appended to their name, as in:
				 * react-C97E4lKa.js
				 * It's ok for most chunks since they change often,
				 * but for React or floating-ui, it's better to simply
				 * call that chunk "react-18.2.0.js". (the version is
				 * the only dynamic part coming from the package.json
				 * file itself), so that it is cached in browsers as
				 * much as possible.
				 */
				chunkFileNames(chunkInfo) {
					if (chunkInfo.name.includes(REACT_CHUNK)) {
						return `react-${reactVersion}.js`;
					}
					if (chunkInfo.name.includes(FLOATING_UI_CHUNK)) {
						return `floating-ui-${floatingUIVersion}.js`;
					}
					return "[name]-[hash].js";
				},
			},
		},
	},
	define: {
		"import.meta.env.BUILDTIME": JSON.stringify(buildTime),
		"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
	},
	plugins: [],
});
