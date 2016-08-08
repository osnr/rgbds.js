import { asm, link, fix } from '../lib';
import { readFileSync, writeFileSync } from 'fs';
import * as assert from 'assert';

describe('sprite.asm', function() {
  it('builds equal ROM', function() {
    const spriteObj = asm(readFileSync('test/sprite.asm', 'utf8'));
    let spriteGb = link([spriteObj]);
    spriteGb = fix(spriteGb);
    assert.deepEqual(new Buffer(spriteGb), readFileSync('test/sprite.expect.gb'));
  });
});
