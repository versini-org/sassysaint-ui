const bundlePath = "../bundlesize/dist/system";
export default {
	report: {
		header: "## Bundle Size (system)",
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: `${bundlePath}/assets/style.css`,
			limit: "8 KB",
		},
		{
			path: `${bundlePath}/assets/index.js`,
			limit: "3 KB",
		},
		{
			path: `${bundlePath}/assets/vendor.js`,
			limit: "46 KB",
		},
	],
};
