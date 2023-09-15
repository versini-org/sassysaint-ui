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

export const persistModel = (model: string) => {
	const obfuscatedCode = obfuscate(model.trim()) || "";
	localStorage.setItem(`sassy-saint-model`, obfuscatedCode);
};

export const persistEngineDetails = (flag: boolean) => {
	const obfuscatedCode = obfuscate(flag ? "yes" : "no") || "no";
	localStorage.setItem(`sassy-saint-engine-name`, obfuscatedCode);
};

export const retrieveModel = () => {
	return unObfuscate(localStorage.getItem(`sassy-saint-model`) || "");
};

export const retrieveEngineDetails = () => {
	const flag = unObfuscate(
		localStorage.getItem(`sassy-saint-engine-name`) || "",
	);
	if (flag === "yes") {
		return true;
	}
	return false;
};

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
