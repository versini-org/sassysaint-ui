import { describe, expect, it } from "vitest";

import {
	convertDDToDMS,
	convertLatitudeToDMS,
	convertLongitudeToDMS,
	durationFormatter,
	extractAverage,
	obfuscate,
	truncate,
	unObfuscate,
} from "../utilities";

describe("Non-DOM tests", () => {
	describe("truncate", () => {
		it("should truncate according to plan", () => {
			expect(truncate("hello world", 5)).toBe("hello...");
			expect(truncate("hello world", 11)).toBe("hello world");
			expect(truncate("hello world", 12)).toBe("hello world");
		});
	});

	describe("convertDDToDMS", () => {
		it("should convert latitude and longitude to degree minutes seconds format", () => {
			expect(convertDDToDMS(0, true)).toEqual({
				dir: "E",
				deg: 0,
				min: 0,
				sec: 0,
			});
			expect(convertDDToDMS(0, false)).toEqual({
				dir: "N",
				deg: 0,
				min: 0,
				sec: 0,
			});
			expect(convertDDToDMS(1.23456789, true)).toEqual({
				dir: "E",
				deg: 1,
				min: 14,
				sec: 4.44,
			});
			expect(convertDDToDMS(1.23456789, false)).toEqual({
				dir: "N",
				deg: 1,
				min: 14,
				sec: 4.44,
			});
		});
	});

	describe("convertLatitudeToDMS", () => {
		it("should convert latitude to degree minutes seconds format", () => {
			expect(convertLatitudeToDMS(undefined)).toBe("N/A");
			expect(convertLatitudeToDMS(0)).toBe("0° 0' 0\" N");
			expect(convertLatitudeToDMS(10.123456)).toBe("10° 7' 24.44\" N");
			expect(convertLatitudeToDMS(-10.123456)).toBe("10° 7' 24.44\" S");
		});
	});

	describe("convertLongitudeToDMS", () => {
		it("should convert longitude to degree minutes seconds format", () => {
			expect(convertLongitudeToDMS(undefined)).toBe("N/A");
			expect(convertLongitudeToDMS(0)).toBe("0° 0' 0\" E");
			expect(convertLongitudeToDMS(10.123456)).toBe("10° 7' 24.44\" E");
			expect(convertLongitudeToDMS(-10.123456)).toBe("10° 7' 24.44\" W");
		});
	});

	describe("obfuscate and unObfuscate", () => {
		it("should obfuscate data", () => {
			expect(obfuscate("hello world")).toBe("aGVsbG8gd29ybGQ=");
		});

		it("should unObfuscate data", () => {
			expect(unObfuscate("aGVsbG8gd29ybGQ=")).toBe("hello world");
		});
	});

	describe("average from array", () => {
		it("should return average from array", () => {
			const formatter = (value: number) => `${value.toFixed(0)}ms`;
			expect(extractAverage({ data: [1, 2, 3, 4, 5], formatter })).toBe("3ms");
			expect(extractAverage({ data: [1, 0, 2, 3, 4, 5], formatter })).toBe(
				"3ms",
			);
			expect(extractAverage({ data: [1, null, 2, 3, 4, 5], formatter })).toBe(
				"3ms",
			);
			expect(
				extractAverage({ data: [1, undefined, 2, 3, 4, 5], formatter }),
			).toBe("3ms");
			expect(extractAverage({ data: [], formatter })).toBe("0ms");
		});

		it("should return average from array with formatter", () => {
			const formatter = (value: number) => value;
			expect(extractAverage({ data: [1, 2, 3, 4, 5], formatter })).toBe(3);
			expect(extractAverage({ data: [1, 0, 2, 3, 4, 5], formatter })).toBe(3);
			expect(extractAverage({ data: [1, null, 2, 3, 4, 5], formatter })).toBe(
				3,
			);
			expect(
				extractAverage({ data: [1, undefined, 2, 3, 4, 5], formatter }),
			).toBe(3);
			expect(extractAverage({ data: [], formatter })).toBe(0);
		});
	});

	describe("durationFormatter", () => {
		it("should convert duration with or without a suffix", () => {
			expect(durationFormatter(100)).toBe("100ms");
			expect(durationFormatter(10000)).toBe("10s");
		});
	});
});
