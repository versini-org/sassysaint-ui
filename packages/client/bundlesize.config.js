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
			limit: "7 kb",
		},
		{
			path: "dist/static/js/*versini_auth-provider*.<hash>.js",
			limit: "28 kb",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
		},
		/**
		 * JavaScript static async assets.
		 */
		{
			path: "dist/static/js/async/*Messages_LazyHeader*.<hash>.js",
			limit: "6 kb",
		},
		{
			path: "dist/static/js/async/*versini_ui-components*.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/async/*App_App*.<hash>.js",
			limit: "8 kb",
		},
		{
			path: "dist/static/js/async/*react-use*.<hash>.js",
			limit: "32 kb",
		},
		{
			path: "dist/static/js/async/*katex*.<hash>.js",
			limit: "51 kb",
		},
		{
			path: "dist/static/js/async/*rehype-highlight*.<hash>.js",
			limit: "130 kb",
		},

		/**
		 * CSS static assets.
		 */
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
		},

		/**
		 * CSS static async assets.
		 */
		{
			path: "dist/static/css/async/vendors-*katex*.<hash>.css",
			limit: "8 kb",
		},
	],
};
