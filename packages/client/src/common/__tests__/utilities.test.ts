import { describe, expect, it } from "vitest";

import {
	convertDDToDMS,
	convertLatitudeToDMS,
	convertLongitudeToDMS,
	truncate,
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
			expect(convertLatitudeToDMS(1.23456789)).toBe("1° 14' 4.44\" N");
			expect(convertLatitudeToDMS(-1.23456789)).toBe("1° 14' 4.44\" S");
		});
	});

	describe("convertLongitudeToDMS", () => {
		it("should convert longitude to degree minutes seconds format", () => {
			expect(convertLongitudeToDMS(undefined)).toBe("N/A");
			expect(convertLongitudeToDMS(0)).toBe("0° 0' 0\" E");
			expect(convertLongitudeToDMS(1.23456789)).toBe("1° 14' 4.44\" E");
			expect(convertLongitudeToDMS(-1.23456789)).toBe("1° 14' 4.44\" W");
		});
	});
});
