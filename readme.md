
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

#### styleType

Should styles be rendered using `style=""` attributes or by using `<b>`, `<i>`, etc. One of `'css'` or `'html'`. Default value: `'html'`.

#### styleTags.bold

Defines how to render bold text when using `html` rendering. Receives the following variables: `content`. Default value:

```html
<b>{content}</b>
```

#### styleTags.italic

Defines how to render italic text when using `html` rendering. Receives the following variables: `content`. Default value:

```html
<i>{content}</i>
```

#### styleTags.underline

Defines how to render underlined text when using `html` rendering. Receives the following variables: `content`. Default value:

```html
<u>{content}</u>
```

#### styleTags.strikethrough

Defines how to render striked text when using `html` rendering. Receives the following variables: `content`. Default value:

```html
<s>{content}</s>
```

#### styleTags.color

Defines how to render colored text when using `html` rendering. Receives the following variables: `content`, `color`. Default value:

```html
<span style="color: {color}">{content}</span>
```

#### text

Defines how to render text when using `css` rendering. Receives the following variables: `content`, `style`. Default value:

```html
<span style="{style}">{content}</span>
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

#### attributes

Defines custom attribute overrides. For example, let's say we want to allow @user style references. We could define these in our deltas using a new attribute:

```javascript
[
    {insert: '@user', attributes: {atref: 'user'}}
]
```

We could render these as links by adding an attribute definition, like this:

```javascript
doc.convertTo('html', {
    attributes: {
        atref: function(node) {
            node.template = '<a href="/users/{atref}" class="atref">{content}</a>';
        }
    }
})
```

For another example, we could set up the renderer to handle the `author` attribute set by Quill's authorship module:

```javascript
doc.convertTo('html', {
    attributes: {
        author: function(node) {
            node.template = '<span class="author-{author}">{content}</span>'
        }
    }
})
```

Or, to get a little fancier, we could do the same thing, but switch out the the authors' names for simple numbers.

```javascript
var users = [ ];

doc.convertTo('html', {
    attributes: {
        author: function(node) {
            node.template = '<span class="author-{author}">{content}</span>';
            var index = users.indexOf(node.data.author);
            if (index < 0) {
                index = users.length;
                users.push(node.data.author);
            }
            node.data.author = index;
        }
    }
})
```

This will output HTML more like this:

```html
<span class="author-0">Within this document, this user will always be known as author "0", which makes it much easier to write generic CSS to stylize different authors.</span>
```