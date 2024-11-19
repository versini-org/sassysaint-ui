export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
			alias: "Initial CSS",
		},
		{
			path: "dist/static/css/async/LazyMessageAssistant.<hash>.css",
			limit: "9 kb",
			alias: "Lazy Message Assistant CSS",
		},
		{
			path: "dist/static/js/index.<hash>.js",
			limit: "73 kb",
			alias: "Initial JS + Vendors (React, auth-provider, etc.)",
		},
		{
			path: "dist/static/js/async/LazyApp.<hash>.js",
			limit: "15 kb",
			alias: "Lazy App JS",
		},
		{
			path: "dist/static/js/async/LazyHeader.<hash>.js",
			limit: "47 kb",
			alias: "Lazy Header JS",
		},
		{
			path: "dist/static/js/async/LazyMessageAssistant.<hash>.js",
			limit: "46 kb",
			alias: "Lazy Message Assistant JS",
		},
		{
			path: "dist/static/js/async/LazyMarkdownWithExtra.<hash>.js",
			limit: "126 kb",
			alias: "Lazy Markdown With Extra JS",
		},
	],
};
