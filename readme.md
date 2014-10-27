
# quilljs-renderer

Renders an insert-only Quilljs delta into various format like HTML and Markdown

## Install

```bash
$ npm install [--save] quilljs-renderer
```

## Basic Usage

```javascript
var renderer  = require('quilljs-renderer');
var Document  = renderer.Document;

// Load the built-in HTML formatter
renderer.loadFormat('html');

// Create a document instance
var doc = new Document([
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
```

Result:

```html
<div id="line-1" style="text-align:right;"><b>Hello, World!</b></div><div id="line-2" style="text-align:left;">This is a demo of the Quilljs Renderer</div><div id="line-3" style=""><img src="monkey.png" alt="Funny monkey picture" /></div>
```

## Formats

### HTML

The HTML formatter supports a number of options to allow customization of the final output. For example, you can change the line wrapper from `<div>` to `<p>`, like this:

```javascript
doc.convertTo('html', {
    line: '<p id="line-{lineNumber}" style="{lineStyle}">{content}</p>'
});
```

The following options are supported:

#### line

Defines the line template. Receives the following variables: `lineNumber`, `lineStyle`, and `content`. Default value:

```html
<div id="line-{lineNumber}" style="{lineStyle}">{content}</div>
```

#### bold

Defines how to render bold text. Receives the following variables: `content`. Default value:

```html
<b>{content}</b>
```

#### italic

Defines how to render italic text. Receives the following variables: `content`. Default value:

```html
<i>{content}</i>
```

#### underline

Defines how to render underlined text. Receives the following variables: `content`. Default value:

```html
<u>{content}</u>
```

#### strikethrough

Defines how to render striked text. Receives the following variables: `content`. Default value:

```html
<s>{content}</s>
```

#### link

Defines how to render links. Receives the following variables: `content`, `link`. Default value:

```html
<a href="{link}">{content}</a>
```

#### embed

Defines the available embed formats. This option should be an object with number keys. The embed templates will receive all attributes defined on the embed's op object as variables. Default value:

```javascript
{
    1: '<img src="{image}" alt="{alt}" />'
}
```