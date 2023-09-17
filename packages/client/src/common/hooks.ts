import {
	LOCAL_STORAGE_ENGINE,
	LOCAL_STORAGE_MODEL,
	LOCAL_STORAGE_PREFIX,
} from "./constants";

function obfuscate(str: string) {
	/**
	 * First we use encodeURIComponent to get percent-encoded
	 * UTF-8, then we convert the percent encodings into raw
	 * bytes which can be fed into btoa.
	 */
	return typeof str === "string"
		? window.btoa(
				encodeURIComponent(str).replace(
					/%([0-9A-F]{2})/g,
					function toSolidBytes(_match, p1) {
						return String.fromCharCode(Number(`0x${p1}`));
					},
				),
		  )
		: null;
}

function unObfuscate(str: string) {
	/**
	 * Going backwards: from bytestream, to percent-encoding,
	 * to original string.
	 */
	return typeof str === "string"
		? decodeURIComponent(
				window
					.atob(str)
					.split("")
					.map(function (c) {
						return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
					})
					.join(""),
		  )
		: null;
}

type LocalStorageKey = typeof LOCAL_STORAGE_MODEL | typeof LOCAL_STORAGE_ENGINE;

export const useLocalStorage = () => {
	return {
		get: (key: LocalStorageKey): string | boolean | null => {
			const data = unObfuscate(
				localStorage.getItem(LOCAL_STORAGE_PREFIX + key) || "",
			);
			if (data === "true" || data === "false") {
				return data === "true";
			}
			return data;
		},
		set: (key: LocalStorageKey, value: string | boolean) => {
			const data = typeof value === "boolean" ? value.toString() : value;
			const obfuscatedValue = obfuscate(data.trim()) || "";
			localStorage.setItem(LOCAL_STORAGE_PREFIX + key, obfuscatedValue);
		},
	};
};
