import clsx from "clsx";
import prettyMilliseconds from "pretty-ms";

import type { GeoLocation } from "./types";

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const DOMAIN = isDev ? "gizmette.local.com" : "gizmette.com";

// function to convert latitude and longitude to degree minutes seconds format
export const convertDDToDMS = (dd: number, lng: boolean) => {
	const dir = dd < 0 ? (lng ? "W" : "S") : lng ? "E" : "N";
	const deg = 0 | Math.abs(dd);
	const min = 0 | ((Math.abs(dd) * 60) % 60);
	const sec = (0 | (((Math.abs(dd) * 60) % 1) * 6000)) / 100;

	return {
		dir,
		deg,
		min,
		sec,
	};
};

export const convertLatitudeToDMS = (lat?: number) => {
	if (!lat && lat !== 0) {
		return "N/A";
	}
	const latitude = convertDDToDMS(lat, false);
	return `${latitude.deg}° ${latitude.min}' ${latitude.sec}" ${latitude.dir}`;
};

export const convertLongitudeToDMS = (lng?: number) => {
	if (!lng && lng !== 0) {
		return "N/A";
	}
	const longitude = convertDDToDMS(lng, true);
	return `${longitude.deg}° ${longitude.min}' ${longitude.sec}" ${longitude.dir}`;
};

/* c8 ignore start */
export const getCurrentGeoLocation = async (): Promise<GeoLocation> => {
	const options = {
		/**
		 * A boolean value that indicates the application would
		 * like to receive the best possible results. If true
		 * and if the device is able to provide a more accurate
		 * position, it will do so. Note that this can result in
		 * slower response times or increased power consumption
		 * (with a GPS chip on a mobile device for example). On
		 * the other hand, if false, the device can take the
		 * liberty to save resources by responding more quickly
		 * and/or using less power. Default: false.
		 */
		enableHighAccuracy: false,
		/**
		 * A positive long value representing the maximum length
		 * of time (in milliseconds) the device is allowed to
		 * take in order to return a position. The default value
		 * is Infinity, meaning that getCurrentPosition() won't
		 * return until the position is available.
		 */
		timeout: 10000,
		/**
		 * A positive long value indicating the maximum age in
		 * milliseconds of a possible cached position that is
		 * acceptable to return. If set to 0, it means that the
		 * device cannot use a cached position and must attempt
		 * to retrieve the real current position. If set to
		 * Infinity the device must return a cached position
		 * regardless of its age. Default: 0.
		 */
		maximumAge: 60000,
	};

	return new Promise((resolve, reject) => {
		navigator?.geolocation?.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				});
			},
			(error) => {
				reject(error);
			},
			options,
		);
	});
};
/* c8 ignore stop */

export const obfuscate = (str: string) => {
	/**
	 * First we use encodeURIComponent to get percent-encoded
	 * UTF-8, then we convert the percent encodings into raw
	 * bytes which can be fed into btoa.
	 */
	return window.btoa(
		encodeURIComponent(str).replace(
			/%([0-9A-F]{2})/g,
			function toSolidBytes(_match, p1) {
				return String.fromCharCode(Number(`0x${p1}`));
			},
		),
	);
};

export const unObfuscate = (str: string) => {
	/**
	 * Going backwards: from bytestream, to percent-encoding,
	 * to original string.
	 */
	return decodeURIComponent(
		window
			.atob(str)
			.split("")
			.map(function (c) {
				return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
			})
			.join(""),
	);
};

export const renderDataAsList = (
	id: string | undefined,
	data: Record<string, any>,
) => {
	return data
		? Object.keys(data).map((key) => {
				return (
					<dl className="my-0" key={`${id}-${key}`}>
						<div className="flex items-center justify-between">
							<dt className="my-1 inline-block font-bold text-copy-dark dark:text-copy-lighter">
								{key}
							</dt>
							<dd className="my-1 inline-block">{data[key]}</dd>
						</div>
					</dl>
				);
			})
		: null;
};

/**
 * Extract the average from a list of numbers.
 *
 * @example
 * const res = extractAverage({ data: [11, 22, 33, 44] });
 * console.log(res); // 27.5 -> (11 + 22 + 33 + 44) / 4
 *
 * Any value that is not a number or is less than 0 will be ignored.
 *
 * A formatter function can be passed to format the output. If no
 * formatter is provided, the default behavior is to cast the number
 * to the generic Output type.
 */
export function extractAverage<Output>({
	data,
	formatter = (value: number) => value as unknown as Output,
}: {
	data: (number | undefined | null)[];
	formatter?: (value: number) => Output;
}): Output {
	const filteredData = data.filter(
		(item) => typeof item === "number" && item > 0,
	);
	const total = filteredData.reduce(
		(acc: number | undefined | null, curr: number | undefined | null) =>
			(acc || 0) + (curr || 0),
		0,
	);
	return total ? formatter(total / filteredData.length) : formatter(0);
}

export const isLastMessageFromRole = (
	role: string,
	state?: { messages: string | any[] },
) => {
	return (
		state &&
		state.messages.length > 0 &&
		state.messages[state.messages.length - 1].message.role === role
	);
};

export const numberFormatter = new Intl.NumberFormat("en", {
	style: "decimal",
	signDisplay: "never",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export const durationFormatter = (value: number) => {
	return value > 0
		? prettyMilliseconds(value, {
				secondsDecimalDigits: 2,
				unitCount: 2,
			})
		: "N/A";
};

export const getMessageContaintWrapperClass = (isAuthenticated?: boolean) => {
	const paddingTop = isAuthenticated || isDev ? "pt-0" : "pt-10";
	return clsx(
		"flex-1 space-y-6 overflow-y-auto rounded-md bg-slate-900 px-4 pb-10 text-base leading-6 text-slate-300 shadow-sm sm:text-base sm:leading-7",
		paddingTop,
	);
};

/**
 * Function that adds an "s" to the end of a word if the count is
 * 0 or greater than 1.
 */
export const pluralize = (word: string, count: number) => {
	return count === 1 ? word : `${word}s`;
};

/**
 * Creates a debounced function that delays invoking the provided function until
 * after the specified wait time has elapsed since the last time the debounced
 * function was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export const debounce = (func: (...args: any[]) => void, wait: number) => {
	let timeout: number | undefined;
	return (...args: any[]) => {
		window.clearTimeout(timeout);
		timeout = window.setTimeout(() => func(...args), wait);
	};
};
