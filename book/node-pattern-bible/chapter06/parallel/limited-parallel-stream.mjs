import { Transform } from 'stream';
export class LimitedParallelStream extends Transform {
  // 1.
  constructor(concurrency, userTransform, opts) {
    super({ objectMode: true, ...opts });
    this.concurrency = concurrency;
    this.userTransform = userTransform;
    this.running = 0;
    this.continueCb = null;
    this.terminateCb = null;
  }

  //2.
  _transform(chunk, enc, done) {
    this.running++;
    this.userTransform(chunk, enc, this.push.bind(this), this._onComplete.bind(this));
    if (this.running < this.concurrency) {
      done();
    } else {
      this.continueCb = done;
    }
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
    const tmpCb = this.continueCb;
    this.continueCb = null;
    tmpCb && tmpCb();
    if (this.running === 0) {
      this.terminateCb && this.terminateCb();
    }
  }
}
