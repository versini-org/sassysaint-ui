/* eslint-disable no-undef */
module.exports = {
	reportOutput: ["github"],
	baseDir: "./dist",
	defaultCompression: "gzip",
	files: [
		{
			path: "index.html",
			maxSize: "2kb",
			maxPercentIncrease: 5,
		},
		{
			path: "assets/index-<hash>.js",
			maxSize: "140kb",
		},
		{
			path: "assets/index-<hash>.css",
			maxSize: "10kb",
		},
		{
			path: "assets/**/*.{png,svg}",
		},
	],
};
