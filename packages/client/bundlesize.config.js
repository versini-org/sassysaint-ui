export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		/**
		 * JavaScript static assets.
		 */
		{
			path: "dist/static/js/index.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/650.<hash>.js",
			limit: "20 kb",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
		},
		/**
		 * JavaScript static async assets.
		 */
		{
			path: "dist/static/js/async/200.<hash>.js",
			limit: "6 kb",
		},
		{
			path: "dist/static/js/async/29.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/async/206.<hash>.js",
			limit: "8 kb",
		},
		{
			path: "dist/static/js/async/265.<hash>.js",
			limit: "30 kb",
		},
		{
			path: "dist/static/js/async/459.<hash>.js",
			limit: "48 kb",
		},
		{
			path: "dist/static/js/async/816.<hash>.js",
			limit: "130 kb",
		},

		/**
		 * CSS static assets.
		 */
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "10 kb",
		},

		/**
		 * CSS static async assets.
		 */
		{
			path: "dist/static/css/async/459.<hash>.css",
			limit: "8 kb",
		},
	],
};
