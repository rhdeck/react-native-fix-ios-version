#!/usr/bin/env node
console.log("Hello there")
var pbxproj = require('xcode'); 
var fs = require('fs');
var path = require('path'); 
var glob = require('glob');
var targetVersion = "11.0"
//Get my directory
var thisPath = process.argv[1];
var thisPath = path.dirname(thisPath); //bin directory
var thisPath = path.dirname(thisPath); //dependency directory
var thisPath = path.dirname(thisPath); // node_modules
var baseName = path.basename(thisPath);
const packagePath = baseName + "/package.json"
if(fs.existsSync(packagePath)) {
  const package = require(packagePath);
  if(typeof package.iosTarget != undefined) {
    targetVersion = package.iosTarget
  }
}
if(!baseName.startsWith("node_modules")) {
  console.log("This is not a dependency: ", thisPath);
  process.exit(); 
}
var thisPath = path.dirname(thisPath); // parent
var iosPath = thisPath + "/ios";
if(!fs.existsSync(iosPath)) {
  console.log("Could not find ios in ", thisPath, iosPath); 
  console.log(fs.readdirSync(thisPath));
  process.exit();
}
xpdir = glob.sync(iosPath +"/*.xcodeproj")[0];
if(xpdir.length === 0) {
  console.log("Could not find xcodeproj directory inside: ", iosPath)
  process.exit();
}
let filename = xpdir + "/project.pbxproj";
let properties = {
  'IPHONEOS_DEPLOYMENT_TARGET': targetVersion
};
if(!fs.existsSync(filename)) {
  console.log("COuld not find pbxproj file:" , filename);
  process.exit(); 
}
var proj = pbxproj.project(filename);
console.log("Hello");
var targets = [];
proj.parse(function(err) {
  const nts = proj.pbxNativeTargetSection();
  for (var key in nts) {
    if(key.endsWith("_comment")) continue; 
    targets.push(nts[key].name)
    console.log("Found target ", key, nts[key].name)
  }
  targets = targets.map((val)=>{
    while (val.startsWith('"')) val = val.substring(1);
    while (val.endsWith('"')) val = val.substring(0, val.length -1)
    return val; 
  });
  targets.sort(); 
  const mainprojects = targets.filter((val) => {
    if(val.endsWith("Tests")) {
      return false; 
    }
    return true;
  });
  var podlines = [];
  podlines.push("# Created by react-native-pod")
  mainprojects.map((project)=>{
    podlines.push("target '"+project+"' do")
    podlines.push("\t# We uncomment because we like dynamic frameworks witn working with swift projects")
    podlines.push("\tuse_frameworks!")
    targets.map((target)=>{
      if(target == project + "Tests") {
        //This is my test project
        podlines.push("\ttarget '" + target + "' do")
        podlines.push("\t\tinherit! :search_paths")
        podlines.push("\t\t# Pods for testing")
        podlines.push("\tend")
      }
    })
    podlines.push("end")
  })
  console.log("Proposed pod file", podlines.join("\n"))
  for(var key in properties) {
    proj.addBuildProperty(key, properties[key]);
  }
  const out = proj.writeSync();
  fs.writeFileSync(filename, out);
});
