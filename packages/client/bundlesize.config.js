export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/index.html",
			limit: "2 kb",
		},
		{
			path: "dist/assets/index-<hash>.js",
			limit: "22 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "10 kb",
		},
		{
			path: "dist/MessageAssistant-<hash>.js",
			limit: "50 kb",
		},
	],
};
