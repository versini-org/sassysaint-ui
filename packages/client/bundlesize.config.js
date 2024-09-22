export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/static/js/async/vendors-node_modules_pnpm_katex_*.<hash>.js",
			limit: "45 kb",
			alias: "KaTeX (JS)",
		},
		{
			path: "dist/static/js/async/vendors-node_modules_pnpm_rehype-highlight_*.<hash>.js",
			limit: "128 kb",
			alias: "rehype-highlight (JS)",
		},

		{
			path: "dist/static/js/index.<hash>.js",
			limit: "6 kb",
			alias: "index (JS)",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "46 kb",
			alias: "React (JS)",
		},
		{
			path: "dist/static/js/vendors-node_modules_pnpm_versini_auth-provider_*.<hash>.js",
			limit: "53 kb",
			alias: "auth-provider (JS)",
		},

		{
			path: "dist/static/css/async/vendors-node_modules_pnpm_katex_*.<hash>.css",
			limit: "9 kb",
			alias: "KaTeX (CSS)",
		},
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
			alias: "index (CSS)",
		},
	],
};
