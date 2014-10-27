
var doc     = require('../document');
var format  = require('stringformat');

var defaults = {
	line: '<div id="line-{lineNumber}" style="{lineStyle}">{content}</div>',
	bold: '<b>{content}</b>',
	italic: '<i>{content}</i>',
	underline: '<u>{content}</u>',
	strikethrough: '<s>{content}</s>',
	link: '<a href="{link}">{content}</a>',
	embed: {
		1: '<img src="{image}" alt="{alt}" />'
	}
};

doc.defineFormat('line', 'html', defaults, processLine);

// 
// Process a single line into HTML
// 
// @param {line} the line object, containing ops and attributes
// @param {options} the options given
// @param {index} the line index (zero-based)
// @return string
// 
function processLine(line, options, index) {
	var attrs = Object.keys(line.attributes || { });

	return format(options.line, {
		lineNumber: index + 1,
		lineStyle: attrs.map(attributeMap).join(''),
		content: line.ops.map(contentMap).join('')
	});

	// 
	// Builds the content of the line
	// 
	function contentMap(op) {
		if (typeof op.insert === 'number') {
			return format(options.embed[op.insert] || '', op.attributes || { });
		}

		if (! op.attributes) {
			return op.insert;
		}

		var content = op.insert;
		Object.keys(op.attributes).forEach(function(attr) {
			switch (attr) {
				case 'bold':
				case 'italic':
				case 'underline':
				case 'strikethrough':
					content = format(options[attr], { content: content });
				break;
				case 'link':
					var data = merge({ }, op.attributes, { content: content });
					content = format(options.link, data);
				break;
			}
		});

		return content;
	}

	// 
	// Builds the style string
	// 
	function attributeMap(attr) {
		var value = line.attributes[attr];

		switch (attr) {
			case 'align':
				return cssProp('text-align', value);
			break;
		}
	}
}

// 
// Returns a CSS formatted string
// 
// @param {key} the css attribute
// @param {value} the css attribute value
// @return string
// 
function cssProp(key, value) {
	return key + ':' + value + ';';
}
