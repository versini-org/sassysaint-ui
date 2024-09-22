export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{ path: "dist/static/js/async/939.<hash>.js", limit: "45 kb" },
		{ path: "dist/static/js/async/44.<hash>.js", limit: "128 kb" },

		{ path: "dist/static/js/index.<hash>.js", limit: "6 kb" },
		{ path: "dist/static/js/lib-react.<hash>.js", limit: "46 kb" },
		{ path: "dist/static/js/383.<hash>.js", limit: "53 kb" },

		{ path: "dist/static/css/async/939.<hash>.css", limit: "9 kb" },
		{ path: "dist/static/css/index.<hash>.css", limit: "11 kb" },
	],
};
