const { execSync } = require("child_process");
const fs = require("fs");

// Load the list of local packages from local-packages.json
const packageData = JSON.parse(fs.readFileSync("local-packages.json", "utf8"));
const packages = Object.keys(packageData.dependencies);

packages.forEach((pkg) => {
	try {
		console.log(`Uninstalling ${pkg} locally...`);
		execSync(`npm uninstall ${pkg}`, { stdio: "inherit" });

		console.log(`Installing ${pkg} globally...`);
		execSync(`npm install -g ${pkg}`, { stdio: "inherit" });
	} catch (err) {
		console.error(`Failed to process ${pkg}:`, err);
	}
});

console.log("All packages have been converted to global installations.");
