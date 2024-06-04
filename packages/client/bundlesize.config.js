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
			path: "dist/static/js/*auth0_auth0*.<hash>.js",
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
			path: "dist/static/js/async/*Messages_LazyHeader*.<hash>.js",
			limit: "6 kb",
		},
		{
			path: "dist/static/js/async/vendors-*ui-components*.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/async/*App_App*.<hash>.js",
			limit: "8 kb",
		},
		{
			path: "dist/static/js/async/*react-use*.<hash>.js",
			limit: "30 kb",
		},
		{
			path: "dist/static/js/async/*katex*.<hash>.js",
			limit: "48 kb",
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
			limit: "10 kb",
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
