//임의의 문자열을 생성하는 스트림
import { Readable } from 'stream';
import Chance from 'chance';

const chance = new Chance();

export class RandomStream extends Readable {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
  }
  _read(size) {
    const chunk = chance.string({ length: size }); //1
    this.push(chunk, 'utf8'); //2
    this.emittedBytes += chunk.length;
    //3
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  }
}
