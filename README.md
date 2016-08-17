# assembleHTML
---
**Atomic Design** meets a **Living Styleguide**

Assemble static HTML and the used Atomic Design Patterns with the help of handlebars and assemble.io. It produces a living styleguide on the fly. Based partly on https://github.com/assemble/assemble-pattern-lab by Jon Schlinkert.

Why another Atomic Design boilerplate? Because this one has as less dependencies as possible, it's easy to configure for several purposes and most of all, if you generate your code through this tool, you'll have always the same code in your living styleguide as you have in production. Additionally you can work against a JSON API / Mock to include data from a database instead of static content.


### Installation and usage
- run `npm install`
- run `bower install`to install the vendor files needed
- run `grunt`for a watch task. It compiles SASS files, concatenates the CSS and JS files.
- run `assemble-html`to assemble your .hbs files into static HTML and copy it into the *_dist* folder. It also creates the styleguide files in the *_dist/_styleguide* folder.
- run `serve`to start the express-server that makes the dynamic styleguide engine work.
- you can visit the style guide at [http://localhost:3000/_dist/_styleguide/index.html](http://localhost:3000/_dist/_styleguide/index.html) and your HTML-page at [http://localhost:3000/_dist/index.html](http://localhost:3000/_dist/index.html).

### Folder structures
#### Root (Dev, just most important file locations)
Just configure and change files in the root folder, never in *_dist*. Files in *_dist* will be overridden every time you run the assemble task. Here are listed just the most imortant folder. The rest like *scss/* should be self-explaining.
```
assembleHTML
│   .assemble.yml
│
└───templates
    │
    ├───layouts
    │   │   default.hbs (set patterns for a default layout)
    │   │   styleguide.hbs (set patterns for the styleguide layout, e.g. includes/footStyleguide.hbs,...)
    │
    └───styleguide
    │   config.json (configurations for the styleguide go here)
    │   index.html (styleguide's start page)
    │   styleguide.css (styleguide's stylings)
    │   styleguide.js (styleguide's generartor engine)
```

#### Output (_dist, will be generated)
```
_dist
│   index.html (this is project's index file)
│   page01.html
│   page02.html
│   ...
│
└───assets
│   │
│   ├───css
│   │   app.css
│   │
│   └───js
│   │   app.pkgd.js
│   │   app.js
│   │
│   └───images
│   │
└───_styleguide (don't change files in this folder! Changes will be overridden...)
│   │   config.json
│   │   index.html (styleguide's index)
│   │   styleguide.css
│   │   styleguide.js
│   │
│   ├───_patterns (just used by the styleguide engine)
│   │   ├
│   │   ├───atoms
│   │   │
│   │   ├───molecules
│   │   │
│   │   ├───organisms
```

### Workflow:
- add component (.hbs).
- add component based .scss-file.
- include .scss-file into app.scss.
- you can pass the content for the assembled HTML-file via YAML front matter or an external .yml or .json file in the data folder. The external file has to have the same name as the .hbs pattern or template. Global contents can be included into the data.json. It's the default file. Contents for the styleguide go into the data/pattern folder.
- include component into styleguide's config.json.
- run `grunt assemble-it` or 'grunt build' to assemble and copy the files into the *_dist* and *_styleguide* folders. The folders will be created if they don't exist already.

### Manage different settings for production and styleguide
If you want to configure different settings in styleguide and production code, here' how to proceed.

Best example is image paths. The image path for your production code is by default *./assets/images/*. But this path wouldn't work for the images within your styleguide patterns. So you have to pass different paths depending on the environment the files are compiled. You could set a handlebar for the image path in your pattern: `<img src="{{{ pattern.image-path }}}your-image.png" alt="" />`. Then you can define the production path via YAML front matter in your *whatever.hbs* and pass the context with the pattern call like so:
```hbs
---
  pattern-path:
   pattern:
    image-path: ./assets/images/
---

{{{ organism "pattern" pattern-path }}}
```
For the styleguide, you simply create a *.json* file with the same name as your pattern in the *data/pattern* folder and define the other path there:
```json
{
  "image-path": "../../../assets/images/"
}
```


### Configure Styleguide
The styleguide files are placed in _templates/_styleguide_ folder. Everything you need to adjust has to be changed here. The styleguide folder within the *_dist_ folder* will be overridden every time you run `assemble-html` ;)

The heart of the sytleguide is the _config.json. Every pattern (atom, molecule, organism) has to be listed here and you can leave a short description for it. That's all you have to do to keep it alive and updated.
To change the theme simply change the CSS within the styleguide.css in the same folder.
```javascript
{
  "title": "Styleguide",
  "intro": "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  "content": {

    "atoms": {
      "description": "Atoms are lorem ipsum.",

      "patterns": {
        "button": "This is a simple button"
      }
    },

    "molecules": {
      "description": "<strong>Molecules</strong> are lorem ipsum dolor.",

      "patterns": {
        "buttonLabel": "A Button with a label"
      }
    },

    "organisms": {
      "description": "Organisms are lorem ipsum dolor sit amet.",

      "patterns": {

      }
    }

  }
}
```

### Additional notes
- You shouldn't use camel-case naming for handlebars or filenames, because in some cases it confuses the assembler engine.
- When writing YAML for passing data, keep care for the proper indentions. Nested objects in YAML are written with an indention of exactly one space. Special characters must be escaped by wrapping them into double quotes. YAML front matter objects must be enclosed into tripple minus. Example:
```yaml
---

button:
 text: "<strong>Example</strong> for writing YAML"

---
```

### To Do:
- Don't use concatenated css and js files. Set up dynamic asset loading for http2 support.
- Add offline support. Idea: use upup.js to store the assembled HTML files and a data.json as asset. Include data via HBS.
