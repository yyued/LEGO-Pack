#!/usr/bin/env node
'use strict'
require('shelljs/global');
const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const env = path.normalize(pwd() + "/" + process.argv[2]);
const name = path.parse(path.normalize(env)).name;
cd(env);
if (process.platform == "win32") {
	exec('DEL /S ../' + name + '.zip');
	exec(path.resolve(path.normalize(process.argv[1]), '../zip.exe') + ' -r -q ../' + name + '.zip *');
}
else {
	rm('-f', '../' + name + '.zip');
	exec('zip -r -q --exclude=*.zip* --exclude=*.git* --exclude=*.svn* --exclude=*.DS_Store* ../' + name + '.zip *');
}
fs.readFile('../' + name + '.zip', function(err, buf) {
	fs.writeFile('../' + name + '.zip.hash', md5(buf), function(err) {
		if (err) {
			console.log(err);
		}
	})
});
