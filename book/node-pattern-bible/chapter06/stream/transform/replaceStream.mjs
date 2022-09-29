import { Transform } from 'stream';
export class ReplaceStream extends Transform {
  constructor(searchStr, replaceStr, options) {
    super({ ...options });
    this.searchStr = searchStr;
    this.replaceStr = replaceStr;
    this.tail = '';
  }

  _transform(chunk, encoding, callback) {
    console.log('------ _transform -------- S');
    const pieces = (this.tail + chunk).split(this.searchStr);
    console.log('pieces : ', pieces);
    const lastPiece = pieces[pieces.length - 1];
    console.log('lastPiece : ', lastPiece);
    const tailLen = this.searchStr.length - 1;
    console.log('tailLen : ', tailLen);
    this.tail = lastPiece.slice(-tailLen);
    console.log('this.tail : ', this.tail);
    console.log('-tailLen : ', -tailLen);
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen);
    console.log('pieces[pieces.length - 1] : ', pieces[pieces.length - 1]);

    this.push(pieces.join(this.replaceStr));
    console.log('pieces.join(this.replaceStr) : ', pieces.join(this.replaceStr));
    console.log('------ _transform -------- E');
    callback();
  }

  _flush(callback) {
    console.log('_flush : ', this.tail);
    this.push(this.tail);
    callback();
  }
}
