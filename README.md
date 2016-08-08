# rgbds.js

Emscripten port of the [RGBDS](https://github.com/bentley/rgbds)
assembler/linker package to JavaScript. Comes with a thin (and incomplete)
type-annotated wrapper.

## Use

```.javascript
var rgbds = require('rgbds.js');
var obj = rgbds.asm('... assembly source ...');
var rom = rgbds.link([obj]);
rom = rgbds.fix(rom);
```

Also see the [test case](test/index.spec.ts), which assembles and
links
[this single-file GB program by Avik Das](https://github.com/avik-das/gbdev/tree/master/sprite).

You can also use `rgbds.js/build/lib/rgb*` packages directly to set up
their runtime environments by hand.

## Build

```
$ git submodule init --recursive
$ npm run build
```
