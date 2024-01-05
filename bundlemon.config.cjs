/* eslint-disable no-undef */
module.exports = {
	reportOutput: ["github"],
	baseDir: "./packages/client/dist",
	defaultCompression: "gzip",
	files: [
		{
			path: "index.html",
			maxSize: "2kb",
			maxPercentIncrease: 5,
		},
		{
			path: "assets/index-<hash>.js",
			maxSize: "100kb",
		},
		{
			path: "assets/MessageAssistant-<hash>.js",
			maxSize: "50kb",
		},
		{
			path: "assets/index-<hash>.css",
			maxSize: "10kb",
		},
	],
};
