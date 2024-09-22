export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "",
			limit: "",
			alias: "",
		},
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
			alias: "Initial CSS",
		},
		{
			path: "dist/static/css/async/LazyMessageAssistant.<hash>.css",
			limit: "10 kb",
			alias: "Lazy Message Assistant CSS",
		},
		{
			path: "dist/static/js/index.<hash>.js",
			limit: "105 kb",
			alias: "Initial JS + Vendors (React, auth-provider, etc.)",
		},
		{
			path: "dist/static/js/async/LazyApp.<hash>.js",
			limit: "7 kb",
			alias: "Lazy App JS",
		},
		{
			path: "dist/static/js/async/LazyHeader.<hash>.js",
			limit: "9 kb",
			alias: "Lazy Header JS",
		},
		{
			path: "dist/static/js/async/LazyMessageAssistant.<hash>.js",
			limit: "46 kb",
			alias: "Lazy Message Assistant JS",
		},
		{
			path: "dist/static/js/async/LazyMarkdownWithExtra.<hash>.js",
			limit: "129 kb",
			alias: "Lazy Markdown With Extra JS",
		},

		// {
		// 	path: "dist/static/js/async/vendors-node_modules_pnpm_katex_*.<hash>.js",
		// 	limit: "45 kb",
		// 	alias: "KaTeX (JS)",
		// },
		// {
		// 	path: "dist/static/js/async/vendors-node_modules_pnpm_rehype-highlight_*.<hash>.js",
		// 	limit: "128 kb",
		// 	alias: "rehype-highlight (JS)",
		// },

		// {
		// 	path: "dist/static/js/index.<hash>.js",
		// 	limit: "6 kb",
		// 	alias: "index (JS)",
		// },
		// {
		// 	path: "dist/static/js/lib-react.<hash>.js",
		// 	limit: "46 kb",
		// 	alias: "React (JS)",
		// },
		// {
		// 	path: "dist/static/js/vendors-node_modules_pnpm_versini_auth-provider_*.<hash>.js",
		// 	limit: "53 kb",
		// 	alias: "auth-provider (JS)",
		// },

		// {
		// 	path: "dist/static/css/async/vendors-node_modules_pnpm_katex_*.<hash>.css",
		// 	limit: "9 kb",
		// 	alias: "KaTeX (CSS)",
		// },
		// {
		// 	path: "dist/static/css/index.<hash>.css",
		// 	limit: "11 kb",
		// 	alias: "index (CSS)",
		// },
	],
};
