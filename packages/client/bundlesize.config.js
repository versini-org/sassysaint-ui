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
			path: "dist/assets/LazyHeader-<hash>.js",
			limit: "31 kb",
		},
		{
			path: "dist/assets/MessageAssistant-<hash>.js",
			limit: "47 kb",
		},
		{
			path: "dist/assets/LazyMarkdownWithExtra-<hash>.js",
			limit: "133 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "10 kb",
		},
		{
			path: "dist/assets/MessageAssistant-<hash>.css",
			limit: "8 kb",
		},
	],
};
