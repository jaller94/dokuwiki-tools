"use strict";

const fs = require('fs');
const path = require('path');


function extractFiles(pagedata) {
	// <(?<TAG>file|script)(?: ?\S* )?(?<FILENAME>.*?)>([\S\s]*?)<\/\1>
	var regex = /<(file|script)(?: ?\S* )?(.*?)>([\S\s]*?)<\/\1>/g;

	var files = [];

	var val;
	while ((val = regex.exec(content)) !== null) {
		var item = {};
		item.tag = val[1];
		item.filename = val[2];
		item.data = val[3].trim();
		files.push( item );
	}

	return files;
}


// DEBUG
process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});

var inputfile = process.argv[2];
var outputfolder = process.argv[3];

var content = fs.readFileSync(inputfile).toString();

var files = extractFiles(content);

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
		if (err) console.error('Was not able to save ' + val.filename);
	});
});