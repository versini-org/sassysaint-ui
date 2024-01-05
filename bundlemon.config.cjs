/* eslint-disable no-undef */
module.exports = {
	reportOutput: ["github"],
	baseDir: "./packages/client/dist",
	defaultCompression: "gzip",
	files: [
		{
			path: "index.html",
			maxSize: "2kb",
		},
		{
			path: "assets/index-<hash>.js",
			maxSize: "20kb",
		},
		{
			path: "assets/index-<hash>.css",
			maxSize: "10kb",
		},
		{
			path: "MessageAssistant-<hash>.js",
			maxSize: "50kb",
		},
	],
};
