module.exports = {
	"*.{ts,js,tsx,jsx}": [
		"prettier --write",
		"eslint --fix",
		"import-sort --write",
	],
};
