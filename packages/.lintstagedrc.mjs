// import baseConfig from "../configuration/lint-staged.config.cjs";

// export default {
// 	...baseConfig,
// };

export default {
	"*.{ts,js,tsx,jsx}": ["lint", "prettier --write"],
};
