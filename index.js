#!/usr/bin/env node
'use strict'

require('shelljs/global');
const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const NodeRsa = require('node-rsa');

if (process.argv.length < 4) {
	console.log("Usage >>> legopack [./Folder/Path] [PrivateKey]")
	exit(-1)
}

const env = path.normalize(pwd() + "/" + process.argv[2]);

const appParams = {
	name: path.parse(path.normalize(env)).name,
	privateKey: process.argv[3],
};

if (appParams.name == undefined || appParams.name.length == 0 || appParams.privateKey == undefined || appParams.privateKey.length === 0) {
	console.log("Usage >>> legopack [./Folder/Path] [./PrivateKey/Path]")
	exit(-1)
}

cd(env);

if (process.platform == "win32") {
	exec('DEL /S ../' + appParams.name + '.zip');
	exec(path.resolve(path.normalize(process.argv[1]), '../zip.exe') + ' -r -q ../' + appParams.name + '.zip *');
}
else {
	rm('-f', '../' + appParams.name + '.zip');
	exec('zip -r -q --exclude=*.zip* --exclude=*.git* --exclude=*.svn* --exclude=*.DS_Store* ../' + appParams.name + '.zip *');
}
fs.readFile('../' + appParams.name + '.zip', function (err, buf) {
	const privateKeyBuffer = fs.readFileSync(appParams.privateKey).toString();
	const rsaKey = new NodeRsa(privateKeyBuffer, {
		signingScheme: 'pkcs1-sha512',
	});
	fs.writeFileSync('../' + appParams.name + '.zip.hash', rsaKey.encryptPrivate(md5(buf), 'base64'));
	fs.writeFileSync('../' + appParams.name + '.zip.pub', rsaKey.exportKey('pkcs8-public'));
});
