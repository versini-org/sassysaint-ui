export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

function obfuscate(str: string) {
	/*
	 * first we use encodeURIComponent to get percent-encoded UTF-8,
	 * then we convert the percent encodings into raw bytes which
	 * can be fed into btoa.
	 */
	return typeof str === "string"
		? window.btoa(
				encodeURIComponent(str).replace(
					/%([0-9A-F]{2})/g,
					function toSolidBytes(match, p1) {
						return String.fromCharCode(`0x${p1}`);
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

export const persistMode = (mode: string) => {
	const obfuscatedCode = obfuscate(mode.trim()) || "";
	localStorage.setItem(`sassy-saint-mode`, obfuscatedCode);
};

export const retrieveMode = () => {
	return unObfuscate(localStorage.getItem(`sassy-saint-mode`) || "");
};
