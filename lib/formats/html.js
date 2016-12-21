
var doc     = require('../document');
var format  = require('stringformat');
var merge   = require('merge-recursive');

var defaults = {
	line: '<div id="line-{lineNumber}" style="{lineStyle}">{content}</div>',
	text: '<span style="{style}">{content}</span>',
	link: '<a href="{link}" style="{style}">{content}</a>',
	styleType: 'html',
	styleTags: {
		color: '<span style="color:{color}">{content}</span>',
		bold: '<b>{content}</b>',
		italic: '<i>{content}</i>',
		underline: '<u>{content}</u>',
		strike: '<s>{content}</s>',
		font: '<span style="font-family:{font}">{content}</span>'
	},
	scripts: {
		super: '<sup style="font-family:vertical-align:super;{font}">{content}</sup>'
	},
	embed: {
		1: '<img src="{image}" alt="{alt}" />'
	},
	attributes: {
		// 
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

		switch (options.styleType) {
			case 'css':
				return drawTextCss(op.insert, op.attributes);
			case 'html':
				return drawTextHtml(op.insert, op.attributes);
		}
	}

	// 
	// Builds the style string containing line-level styles (like alignment)
	// 
	function attributeMap(attr) {
		var value = line.attributes[attr];

		switch (attr) {
			case 'align':
				return cssProp('text-align', value);
			break;
		}
	}

	// 
	// Render a section of text using style HTML tags like <b> and <i>
	// 
	function drawTextHtml(content, attrs) {
		Object.keys(attrs).forEach(function(attr) {
			var node = {
				template: null,
				data: merge({ }, attrs, { content: content, style: '' })
			};

			switch (attr) {
				case 'link':
					node.template = options.link;
				break;
				case 'color':
				case 'bold':
				case 'italic':
				case 'underline':
				case 'strike':
				case 'font':
					node.template = options.styleTags[attr];
				break;
				case 'script':
					node.template = options.scripts[attrs[attr]];
				break;
				default:
					if (options.attributes) {
						attr = options.attributes[attr];
						if (attr) {
							attr(node, options);
						}
					}
				break;
			}

			content = format(node.template, node.data);
		});

		return content;
	}

	// 
	// Render a section of text using CSS for styling
	// 
	function drawTextCss(content, attrs) {
		var node = {
			template: attrs.link ? options.link : options.text,
			data: merge({ }, attrs || { }, { content: content, style: '' })
		};

		Object.keys(attrs).forEach(function(attr) {
			switch (attr) {
				case 'color':
					node.data.style += cssProp('color', attrs.color);
				break;
				case 'bold':
					node.data.style += cssProp('font-weight', 'bold');
				break;
				case 'italic':
					node.data.style += cssProp('font-style', 'italic');
				break;
				case 'underline':
					node.data.style += cssProp('text-decoration', 'underline');
				break;
				case 'strike':
					node.data.style += cssProp('text-decoration', 'line-through');
				break;
				case 'font':
					node.data.style += cssProp('font-family', attrs.font);
				break;
				default:
					if (options.attributes) {
						attr = options.attributes[attr];
						if (attr) {
							attr(node, options);
						}
					}
				break;
			}
		});

		return format(node.template, node.data);
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
