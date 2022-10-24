import { Transform } from 'stream';
export class ParallelStream extends Transform {
  // 1.
  constructor(userTransform, opts) {
    super({ objectMode: true, ...opts });
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCb = null;
  }

  //2.
  _transform(chunk, enc, done) {
    this.running++;
    this.userTransform(chunk, enc, this.push.bind(this), this._onComplete.bind(this));
    done();
  }

  //3.
  _flush(done) {
    if (this.running > 0) {
      this.terminateCb = done;
    } else {
      done();
    }
  }

  //4.
  _onComplete(err) {
    this.running--;
    if (err) {
      return this.emit('error', err);
    }
    if (this.running === 0) {
      this.terminateCb && this.terminateCb();
    }
  }
}
