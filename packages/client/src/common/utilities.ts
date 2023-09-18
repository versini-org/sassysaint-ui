import type { GeoLocation } from "../common/types";

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const truncate = (str: string, length: number) => {
	return str.length > length ? str.substring(0, length) + "..." : str;
};

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
	if (!lat) return "N/A";
	const latitude = convertDDToDMS(lat, false);
	return `${latitude.deg}° ${latitude.min}' ${latitude.sec}" ${latitude.dir}`;
};

export const convertLongitudeToDMS = (lng?: number) => {
	if (!lng) return "N/A";
	const longitude = convertDDToDMS(lng, true);
	return `${longitude.deg}° ${longitude.min}' ${longitude.sec}" ${longitude.dir}`;
};

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

export const getViewportWidth = () => {
	return Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0,
	);
};
