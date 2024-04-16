export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/index.html",
			limit: "2 kb",
		},
		{
			path: "dist/assets/index-<hash>.js",
			limit: "25 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "10 kb",
		},
		{
			path: "dist/MessageAssistant-<hash>.js",
			limit: "50 kb",
		},
		{
			path: "dist/auth0-<semver>.js",
			limit: "16 kb",
		},
		{
			path: "dist/floating-ui-<semver>.js",
			limit: "21 kb",
		},
		{
			path: "dist/react-<semver>.js",
			limit: "46 kb",
		},
	],
};
