"use strict";

function showHelp() { console.log(help); }
const help = `=== USAGE ===
dw2files <input file> <output folder>`;


const fs = require('fs');
const path = require('path');
const dwpage = require('./dokuwiki.module.js');

const INFO = 1;
const WARNING = 2;
const ERROR = 3;

var verbose = INFO;


// Parse command line parameters
var argv = require('minimist')(process.argv.slice(2));

if (typeof argv.h !== 'undefined' || typeof argv.help !== 'undefined') {
	showHelp();
	process.exit(0);
}

// Read command line parameters
var inputfile = argv._[0];
var outputfolder = argv._[1];

// Test input command line parameter
if (typeof inputfile === 'undefined') {
	console.error('The essential source parameter is not set.\n');
	showHelp();
	process.exit(1);
}
inputfile = String(inputfile); // Convert (could be a string / number)

// Test output command line parameter
if (typeof outputfolder === 'undefined') {
	outputfolder = './';
}
var outputfolder = String(outputfolder); // Convert (could be a string / number)

// Open / Parse DokuWiki page (the input)
var content = fs.readFileSync(inputfile).toString();

var page = new dwpage(content);

var files = page.getFiles();

// DEBUG
//fs.writeFileSync(inputfile+".txt", JSON.stringify(files, null, "\t"));

var isfolder = false;
try {
	isfolder = fs.statSync(outputfolder).isDirectory();
} catch (err) {

}

if (!isfolder) {
	console.error('Output path has to be a directory!');
	process.exit(1);
}

files.forEach(function (val, index, array) {
	var filepath = path.resolve(outputfolder, val.filename);
	fs.writeFile(filepath, val.data, (err) => {
		if (err) {
			console.error('Was not able to save ' + val.filename);
		} else {
			if (verbose == INFO) console.log('File processed: ' + val.filename);
		}
	});
});
