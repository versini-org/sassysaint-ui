/** @type {import('tailwindcss').Config} */

import { twPlugin } from "@versini/ui-components/dist/utilities";

export default twPlugin.merge({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
});
