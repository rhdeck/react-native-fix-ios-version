const fs = require("fs");
const cp = require("child_process");
const Path = require("path");
module.exports = {
  commands: [
    {
      name: "set-ios-version <version>",
      description: "Set target version for this app",
      func: args => {
        const version = args[0];
        const packagePath = Path.join(process.cwd(), "package.json");
        if (!fs.existsSync(packagePath)) {
          console.log(
            "Could not find package.json in current directory - aborting"
          );
          return;
        }
        const p = require(packagePath);
        p.iosTarget = version;
        fs.writeFileSync(packagePath, JSON.stringify(p, null, 2));
        cp.spawnSync("./node_modules/.bin/fix-ios-version", {
          stdio: "inherit"
        });
        console.log("Assigned to version ", version);
      }
    }
  ]
};
