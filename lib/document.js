
var merge = require('merge-recursive');

// 
// This is where we store the various formats for output
// 
var formats = { };

// 
// Define a new output format
// 
// @param {type} optional, the type of processing function ("line", "op", or "raw")
// @param {name} the name of the format
// @param {defaults} defaults options
// @param {func} the processing function
// @return void
// 
exports.defineFormat = function(type, name, defaults, func) {
	formats[name] = {
		type: type,
		func: func,
		defaults: defaults
	};
};

// 
// Load a built-in format
// 
// @param {format} the format to load
// @return void
// 
exports.loadFormat = function(format) {
	require('./formats/' + format);
};

// 
// The main constructor
// 
// @param {delta} the delta to be rendered
// 
var Document = exports.Document = function(delta) {
	if (delta.ops) {
		delta = delta.ops;
	}
	this.delta = delta || [ ];
};

// 
// Convert the document into the given format
// 
// @param {format} the format to convert to
// @param {options} formatting options
// @return string
// 
Document.prototype.convertTo = function(format, options) {
	format = formats[format];

	if (! format) {
		throw new Error('Unknown conversion format "' + format + '"');
	}

	options = merge.recursive({ }, format.defaults || { }, options || { });

	switch (format.type) {
		case 'line':
			return lineTypeConvert(this.delta, format.func, options);
		case 'op':
			return this.delta.map(function(op, index) {
				return format.func(op, options, index);
			});
		case 'raw':
			return format.func(this.delta, options);
		default:
			throw new Error('Unknown conversion format type "' + format.type + '"');
	}
};

// 
// Perform a line type conversion
// 
// @param {delta} the document delta
// @param {func} the formatting function
// @param {options} formatting options
// @return string
// 
function lineTypeConvert(delta, func, options) {
	var op, lines, line;
	var ops = delta.slice();
	var content = '';
	var index = 0;

	while (ops.length) {
		lines = [ ];
		lines.push(
			line = { ops: [ ], attributes: { } }
		);

		for (op = ops.shift(); op && op.insert !== '\n'; op = ops.shift()) {
			var text = op.insert;
			if (typeof text === 'string' && text.indexOf('\n') >= 0) {
				var chunks = text.split('\n');
				for (var i = 0, c = chunks.length; i < c; i++) {
					if (chunks[i].length) {
						line.ops.push({
							insert: chunks[i], attributes: op.attributes
						});
					} else {
						lines.pop();
					}
					if ((i + 1) < c) {
						lines.push(
							line = { ops: [ ], attributes: { } }
						);
					}
				}
				break;
			} else {
				line.ops.push(op);
			}
		}

		if (op && op.insert !== '\n') {
			if (ops[0] && ops[0].insert === '\n') {
				op = ops.shift();
			} else {
				op = null;
			}
		}

		lines.forEach(function(line) {
			line.attributes = (op && op.attributes);
			content += func(line, options, index++);
		});
	}

	return content;
}
