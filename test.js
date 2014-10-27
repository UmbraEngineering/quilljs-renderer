
var renderer = require('./index');

renderer.loadFormat('html');

var doc = module.exports = new renderer.Document([
	{insert: 'Hello, World!', attributes: {bold: true}},
	{insert: '\n', attributes: {align: 'right'}},
	{insert: 'This is a demo of the Quilljs Renderer'},
	{insert: '\n', attributes: {align: 'left'}},
	{insert: 1, attributes: {
		image: 'monkey.png',
		alt: 'Funny monkey picture'
	}},
	{insert: '\n', attributes: {align: 'left'}},
	{insert: '@jbrumond', attributes: {atref: 'jbrumond'}}
]);

console.log(doc.convertTo('html', {
	// styleType: 'css',
	attributes: {
		// Use a link for @refs
		atref: function(node, options) {
			node.template = '<a href="{link}" class="atref">{content}</a>';
			node.data.link = '/#user/' + node.data.atref;
		}
	}
}));
