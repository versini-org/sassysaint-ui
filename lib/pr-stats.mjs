import { basename } from "node:path";

import bytes from "bytes";
import fs from "fs-extra";
import semver from "semver";

const PR_STATS_JSON = "packages/client/tmp/stats.json";
const MAIN_STATS_JSON = "packages/client/stats/stats.json";
const UI_PACKAGE_JSON = "packages/client/package.json";

const { readJsonSync } = fs;

const percentFormatter = new Intl.NumberFormat("en", {
	style: "percent",
	signDisplay: "exceptZero",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

let limitReached = false;
let overallDiff = 0;
const currentStats = readJsonSync(PR_STATS_JSON);
const previousStats = readJsonSync(MAIN_STATS_JSON);
const { version } = readJsonSync(UI_PACKAGE_JSON);
const rows = [
	"| Status | File | Size (Gzip) | Limits |",
	"| ---- | ---- | ---- | ----- |",
];

const keys = [];
Object.keys(previousStats).forEach((key) => {
	keys.push(key);
});
keys.sort(semver.rcompare);
const previousVersion = keys[0];

Object.keys(currentStats[version]).forEach((key) => {
	const item = currentStats[version][key];
	const name = basename(key);
	const passed = item.passed ? "✅" : "🚫";
	if (!item.passed) {
		limitReached = true;
	}

	const previousFileStats =
		previousStats[previousVersion] && previousStats[previousVersion][key];
	const previousFileSizeGzip = previousFileStats
		? previousFileStats.fileSizeGzip
		: 0;

	const diff = item.fileSizeGzip - previousFileSizeGzip;
	overallDiff += diff;
	const diffStr =
		diff !== 0
			? ` (${diff > 0 ? "+" : "-"}${bytes(Math.abs(diff), {
					unitSeparator: " ",
				})} ${percentFormatter.format(diff / previousFileSizeGzip)})`
			: "";

	rows.push(
		`${passed} | ${name.replace(/</g, "[").replace(/>/g, "]")} | ${bytes(
			item.fileSizeGzip,
			{
				unitSeparator: " ",
			},
		)}${diffStr} | ${item.limit}`,
	);
});

const overallDiffStr =
	overallDiff !== 0
		? `(${overallDiff > 0 ? "+" : "-"}${bytes(Math.abs(overallDiff), {
				unitSeparator: " ",
			})})`
		: "";

const template = `
## Bundle Size
${rows.join("\n")}

Overall status: ${limitReached ? "🚫" : "✅"} ${overallDiffStr}
`;

const file = "tmp/pr-stats.md";
fs.outputFileSync(file, template);

if (limitReached) {
	// eslint-disable-next-line no-undef
	process.exit(1);
}
