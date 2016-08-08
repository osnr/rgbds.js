import { asm, link, fix } from '../lib';
import { readFileSync, writeFileSync } from 'fs';
import * as assert from 'assert';

describe('sprite.asm', function() {
  it('builds equal ROM multiple times', function() {
    function assertBuild(): Uint8Array {
      const spriteObj = asm(readFileSync('test/sprite.asm', 'utf8'));
      let spriteGb = link([spriteObj]);
      spriteGb = fix(spriteGb);
      assert.deepEqual(new Buffer(spriteGb), readFileSync('test/expect/sprite.gb'));

      return spriteGb;
    }
    assertBuild();
    assertBuild();
    assertBuild();
  });
});
