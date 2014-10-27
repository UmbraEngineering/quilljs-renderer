
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
	}}
]);

console.log(doc.convertTo('html'));
