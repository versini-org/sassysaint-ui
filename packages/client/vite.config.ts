import { defineConfig } from "vite";
import fs from "fs-extra";

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

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		"import.meta.env.BUILDTIME":
			process.env.NODE_ENV === "production"
				? JSON.stringify(buildTime)
				: JSON.stringify("dev mode"),
		"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
		"import.meta.env.OPENAI_MODEL": JSON.stringify("gpt-3.5-turbo"),
	},
	plugins: [],
});
