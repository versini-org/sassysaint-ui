import type { GeoLocation } from "./types";

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;
export const isLocal = window.location.hostname !== "chat.gizmette.com";

export const truncate = (str: string, length: number) => {
	return str.length > length ? str.substring(0, length) + "..." : str;
};

/* c8 ignore start */
export const serviceCall = async ({
	name,
	data,
	method = "POST",
}: {
	name: string;
	data: any;
	method?: string;
}) => {
	const response = await fetch(
		`${import.meta.env.VITE_SERVER_URL}/api/${name}`,
		{
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);
	return response;
};
/* c8 ignore stop */

// function to convert latitude and longitude to degree minutes seconds format
export const convertDDToDMS = (dd: number, lng: boolean) => {
	return {
		dir: dd < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
		deg: 0 | (dd < 0 ? (dd = -dd) : dd),
		min: 0 | (((dd += 1e-9) % 1) * 60),
		sec: (0 | (((dd * 60) % 1) * 6000)) / 100,
	};
};

export const convertLatitudeToDMS = (lat?: number) => {
	if (!lat && lat !== 0) return "N/A";
	const latitude = convertDDToDMS(lat, false);
	return `${latitude.deg}° ${latitude.min}' ${latitude.sec}" ${latitude.dir}`;
};

export const convertLongitudeToDMS = (lng?: number) => {
	if (!lng && lng !== 0) return "N/A";
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

export const renderDataAsList = (title: string, data: Record<string, any>) => {
	const totalEntries = Object.keys(data).length;
	return data
		? Object.keys(data).map((key, idx) => {
				const isLast = Number(idx) === totalEntries - 1;
				return (
					<dl className={isLast ? "mb-0" : "mb-5"} key={`${title}-${key}`}>
						<div className="flex items-center justify-between">
							<dt className="inline-block font-bold text-slate-400">{key}</dt>
							<dd className="inline-block">{data[key]}</dd>
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
 * A formatter function can be passed to format the output.
 */
export function extractAverage<Output>({
	data,
	formatter,
}: {
	data: (number | undefined | null)[];
	formatter?: (value: number) => Output;
}): Output {
	formatter = formatter || ((value: number) => value as unknown as Output);

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
