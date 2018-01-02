#!/usr/bin/env node
var pbxproj = require("xcode");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var targetVersion = "11.0";
//Get my directory
var thisPath = process.argv[1];
var thisPath = path.dirname(thisPath); //bin directory
var thisPath = path.dirname(thisPath); //dependency directory
var thisPath = path.dirname(thisPath); // node_modules
var baseName = path.basename(thisPath);
const packagePath = baseName + "/package.json";
if (fs.existsSync(packagePath)) {
  const package = require(packagePath);
  if (typeof package.iosTarget != undefined) {
    targetVersion = package.iosTarget;
  }
}
if (!baseName.startsWith("node_modules")) {
  console.log("This is not a dependency: ", thisPath);
  process.exit();
}
var thisPath = path.dirname(thisPath); // parent
var iosPath = path.resolve(thisPath, "ios");
if (!fs.existsSync(iosPath)) {
  console.log("Could not find ios in ", thisPath, iosPath);
  console.log(fs.readdirSync(thisPath));
  process.exit();
}
xpdir = glob.sync(iosPath + "/*.xcodeproj")[0];
if (xpdir.length === 0) {
  console.log("Could not find xcodeproj directory inside: ", iosPath);
  process.exit();
}
let filename = path.resolve(xpdir, "project.pbxproj");
let properties = {
  IPHONEOS_DEPLOYMENT_TARGET: targetVersion
};
if (!fs.existsSync(filename)) {
  console.log("Could not find pbxproj file:", filename);
  process.exit();
}
var proj = pbxproj.project(filename);
proj.parse(function(err) {
  for (var key in properties) {
    proj.addBuildProperty(key, properties[key]);
  }
  const out = proj.writeSync();
  fs.writeFileSync(filename, out);
});
