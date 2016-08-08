import { asm, link, fix } from '../lib';
import { readFileSync, writeFileSync } from 'fs';
import * as assert from 'assert';

describe('sprite.asm', function() {
  function build(asmPath: string): Buffer {
    const spriteObj = asm(readFileSync(asmPath, 'utf8'));
    let spriteGb = link([spriteObj]);
    spriteGb = fix(spriteGb);
    return new Buffer(spriteGb);
  }

  it('builds equal ROM', function() {
    assert.deepEqual(build('test/sprite.asm'), readFileSync('test/sprite.expect.gb'));
  });

  // FIXME: Make module reusable.
  // it('builds equal ROM again', function() {
  //   assert.deepEqual(build('test/sprite.asm'), readFileSync('test/sprite.expect.gb'));
  // });
});
