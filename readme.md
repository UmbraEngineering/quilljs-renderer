
# quilljs-renderer

Renders an insert-only Quilljs delta into various format like HTML and Markdown

## Install

```bash
$ npm install [--save] quilljs-renderer
```

## Basic Usage

```javascript
var Document = require('quilljs-renderer').Document;

var doc = new Document([
    {insert: 'Hello, World!', attributes: {bold: true}}
]);

doc.convertTo('html', {
    line: '<p class="line" id="line-{lineNum}" style="{lineStyle}">{content}</p>'
});

//
// <p class="line" id="line-1" style=""><b>Hello, World!</b></p>
//
```

