const path = require("path");
const { execSync } = require("child_process");
const ts_loaderPath = execSync("npm root -g").toString().trim() + "/ts-loader";
const globPath = execSync("npm root -g").toString().trim() + "/glob";
const glob = require(globPath);

const entries = {};
glob.sync("./TS/*.ts").forEach((file) => {
	const name = path.basename(file, ".ts");
	entries[name] = file;
});

module.exports = {
	entry: entries,
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "./JS"),
	},
	resolve: {
		extensions: [".ts", ".js"],
		preferRelative: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ts_loaderPath,
				exclude: /node_modules/,
			},
		],
	},
	mode: "production",
};
