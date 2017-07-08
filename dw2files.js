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

const verbose = INFO;


// Parse command line parameters
const argv = require('minimist')(process.argv.slice(2));

if (typeof argv.h !== 'undefined' || typeof argv.help !== 'undefined') {
	showHelp();
	process.exit(0);
}

// Read command line parameters
let inputFilePath = argv._[0];
let outputFolderPath = argv._[1];

// Test input command line parameter
if (typeof inputFilePath === 'undefined') {
	console.error('Required parameter missing: source file.\n');
	showHelp();
	process.exit(1);
}
inputFilePath = String(inputFilePath); // Convert (could be a string / number)

// Test output command line parameter
if (typeof outputFolderPath === 'undefined') {
	outputFolderPath = './';
}
outputFolderPath = String(outputFolderPath); // Convert (could be a string / number)

// Open / Parse DokuWiki page (the input)
let content = fs.readFileSync(inputFilePath).toString();

let page = new dwpage(content);

let files = page.getFiles();

// DEBUG
//fs.writeFileSync(inputFilePath+".txt", JSON.stringify(files, null, "\t"));

let isfolder = false;
try {
	isfolder = fs.statSync(outputFolderPath).isDirectory();
} catch (err) {

}

if (!isfolder) {
	console.error('Output path has to be a directory!');
	process.exit(1);
}

files.forEach(function (val, index, array) {
	let filepath = path.resolve(outputFolderPath, val.filename);
	fs.writeFile(filepath, val.data, (err) => {
		if (err) {
			console.error('Was not able to save ' + val.filename);
		} else {
			if (verbose === INFO) console.log('File processed: ' + val.filename);
		}
	});
});
