export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		/**
		 * JavaScript assets.
		 */
		{
			path: "dist/assets/index-<hash>.js",
			limit: "69 kb",
		},
		{
			path: "dist/assets/index0-<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/assets/App-<hash>.js",
			limit: "4 kb",
		},
		{
			path: "dist/assets/LazyHeader-<hash>.js",
			limit: "31 kb",
		},
		{
			path: "dist/assets/LazyMessageAssistant-<hash>.js",
			limit: "47 kb",
		},
		{
			path: "dist/assets/LazyMarkdownWithExtra-<hash>.js",
			limit: "130 kb",
		},

		/**
		 * CSS assets.
		 */
		{
			path: "dist/assets/index-<hash>.css",
			limit: "10 kb",
		},
		{
			path: "dist/assets/LazyMessageAssistant-<hash>.css",
			limit: "8 kb",
		},
	],
};
