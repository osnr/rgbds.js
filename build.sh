#!/bin/bash -eux

tsc

cd rgbds
emmake make CFLAGS=-U__GNUC__
cd ..

mkdir -p build/lib

TEMPPRE=$(mktemp)
TEMPPOST=$(mktemp)
echo 'module.exports = (function(Module) {' > $TEMPPRE
echo 'Module.FS = FS; return Module; });' > $TEMPPOST

for target in rgbasm rgblink rgbfix; do
    cp rgbds/$target build/$target.bc
    emcc build/$target.bc --pre-js $TEMPPRE --post-js $TEMPPOST -s EXPORTED_FUNCTIONS='["_main"]' -o build/lib/$target.js
    rm build/$target.bc
done
