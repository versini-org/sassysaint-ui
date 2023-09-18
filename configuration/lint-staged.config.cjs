module.exports = {
	"*.{ts,js,tsx,jsx}": [
		"eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix",
		"prettier --write",
	],
};
