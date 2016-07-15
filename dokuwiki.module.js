"use strict";

const regex_title = /======(.*?)======/;

class DokuWikiPage {
	constructor(content) {
		this.setContent(content);
	}

	getContent() {
		return this.content;
	}

	getFiles() {
		// <(?<TAG>file|script)(?: ?\S* )?(?<FILENAME>.*?)>([\S\s]*?)<\/\1>
		var regex = /<(file|script)(?: ?\S* )?(.*?)>([\S\s]*?)<\/\1>/g;

		var files = [];

		var val;
		while ((val = regex.exec(this.content)) !== null) {
			var item = {};
			item.tag = val[1];
			item.filename = val[2];
			item.data = val[3].trim();
			files.push( item );
		}

		return files;
	}

	getTitle() {
		var title = regex_title.exec(this.content);
		if (typeof title === 'string') title = title.trim();
		return title;
	}

	setContent(content) {
		this.content = content;
	}

	setTitle(title) {
		this.content.replace(regex_title, '====== ' + title + ' ======');
		return ();
	}
}

module.exports = DokuWikiPage;