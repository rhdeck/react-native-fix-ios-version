#!/usr/bin/env node
var pbxproj = require("xcode");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var targetVersion = "11.2";
const packagePath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packagePath)) {
  const package = require(packagePath);
  if (typeof package.iosTarget != undefined) {
    targetVersion = package.iosTarget;
  }
}
var iosPath = path.resolve(process.cwd(), "ios");
if (!fs.existsSync(iosPath)) {
  console.log("Could not find path ", iosPath);
  console.log(fs.readdirSync(thisPath));
  process.exit();
}
xpdir = glob.sync(path.join(iosPath, "*.xcodeproj"))[0];
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
