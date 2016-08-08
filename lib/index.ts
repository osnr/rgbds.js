import RgbasmFactory = require('./rgbasm');
import RgblinkFactory = require('./rgblink');
import RgbfixFactory = require('./rgbfix');

function callMain(Module: any, args: any) {
  var argc = args.length;

  var argPtrs = args.map(function(arg: string) {
    var ptr: number = Module._malloc(arg.length + 1);
    Module.writeStringToMemory(arg, ptr);
    return ptr;
  });

  var argv = Module._malloc(argPtrs.length * 4);
  argPtrs.forEach(function(ptr: number, i: number) {
    Module.setValue(argv + i*4, ptr, '*');
  });

  Module._main(argc, argv);
}

export type AsmOptions = {
  // -b chars
  // Change the two characters used for binary constants.  The defaults are 01.
  bChars?: string;

  // -D name[=value]
  // Add string symbols to the compiled source code. This is equivalent to name EQUS "value" in
  // code. If a value is not specified, a value of 1 is given.
  defines?: {[name: string]: string};

  // -g chars
  // Change the four characters used for binary constants.  The defaults are 0123.
  gChars?: string;

  // -h
  // By default, rgbasm inserts a `nop' instruction immediately after any `halt' instruction.
  // The -h option disables this behavior.
  noNopAfterHalt?: boolean;

  // -i path
  // Add include paths.
  includePaths?: string[];

  // -p pad_value
  // When padding an image, pad with this value.  The default is 0x00.
  padValue?: number;

  // -v
  // Be verbose.
  verbose?: boolean;
};

let Rgbasm: any;
export function asm(source: string, opts: AsmOptions = {}): Uint8Array {
  const {
    bChars = '01',
    defines = {},
    gChars = '0123',
    noNopAfterHalt = false,
    includePaths = [],
    padValue = 0x00,
    verbose = false
  } = opts;

  if (!Rgbasm) {
    Rgbasm = RgbasmFactory({
      noInitialRun: true
    });
  }

  const args = [
    'rgbasm',
    '-o', 'out.o',
  ];
  if (noNopAfterHalt) args.push('-h');
  for (name in defines) {
    if (!defines.hasOwnProperty(name)) continue;
    const value = defines[name];
    args.push('-D');
    args.push(`${name}=${value}`);
  }
  if (verbose) args.push('-v');
  args.push('in.asm');

  Rgbasm.FS.writeFile('in.asm', source);
  callMain(Rgbasm, args);

  return Rgbasm.FS.readFile('out.o', { encoding: 'binary' });
}

export type LinkOptions = {
  // -p pad_value
  // When padding an image, pad with this value.
  // The default is 0x00.
  padValue?: number;
};

let Rgblink: any;
export function link(objs: Uint8Array[], opts: LinkOptions = {}): Uint8Array {
  const {
    padValue = 0x00
  } = opts;

  if (!Rgblink) {
    Rgblink = RgblinkFactory({
      noInitialRun: true
    });
  }

  const args = [
    'rgblink',
    '-p', padValue.toString(),
    '-o', 'out.gb'
  ];
  objs.forEach((obj, idx) => {
    const objPath = idx + '.o';
    args.push(objPath);
    Rgblink.FS.writeFile(objPath, obj, { encoding: 'binary' });
  });

  callMain(Rgblink, args);

  return Rgblink.FS.readFile('out.gb', { encoding: 'binary' });
}

let Rgbfix: any;
export function fix(gb: Uint8Array): Uint8Array {
  if (!Rgbfix) {
    Rgbfix = RgbfixFactory({
      noInitialRun: true
    });
  }

  Rgbfix.FS.writeFile('rom.gb', gb, { encoding: 'binary' });
  callMain(Rgbfix, ['rgbfix', '-p', '0', '-v', 'rom.gb']);
  return Rgbfix.FS.readFile('rom.gb', { encoding: 'binary' });
}
