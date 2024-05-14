export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/assets/index-<hash>.js",
			limit: "77 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "10 kb",
		},
		{
			path: "dist/assets/LazyHeader-<hash>.js",
			limit: "31 kb",
		},
		{
			path: "dist/assets/MessageAssistant-<hash>.js",
			limit: "96 kb",
		},
	],
};
