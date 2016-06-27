"use strict";

const fs = require('fs');
const path = require('path');

// DEBUG
process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});

var inputfolder = process.argv[2];
var outputfile = process.argv[3];

var files = fs.readdirSync(inputfolder);

console.log('outputfile: ' + path.resolve(outputfile));
var output_filedescriptor = fs.openSync(path.resolve(outputfile),'w');

var title = '';

if (title) {
	fs.writeFileSync(output_filedescriptor, '====== ' + title.trim() + ' ======\n');
}

var page = '';
//files.forEach(function (val, index, array) {
files.forEach(function (val, index, array) {
	var file = {};
	file.name = val;
	file.path = path.resolve(inputfolder, file.name);
	file.buffer = fs.readFileSync(file.path);

	fs.writeSync(output_filedescriptor, '<script - ' + file.name + '>\n');
	fs.writeSync(output_filedescriptor, file.buffer.toString());
	fs.writeSync(output_filedescriptor, '\n</script>\n\n');
});

fs.close(output_filedescriptor);