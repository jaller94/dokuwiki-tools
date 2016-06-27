"use strict";

const fs = require('fs');
const path = require('path');

// Parse command line parameters
var argv = require('minimist')(process.argv.slice(2));

var inputfolder = String(argv._[0]);
var outputfile = String(argv._[1]);

// Open file handler for the output page
var output_filedescriptor = fs.openSync(path.resolve(outputfile),'w');

// Add a page title
if (argv.t || argv.title) {
	var title = String(argv.t || argv.title).trim();
	fs.writeFileSync(output_filedescriptor, '====== ' + title + ' ======\n');
}

var files = fs.readdirSync(inputfolder);

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