import { Transform } from 'stream';

export class FilterByContry extends Transform {
  constructor(country, options = {}) {
    options.objectMode = true;
    super(options);
    this.country = country;
  }

  _transform(record, enc, cb) {
    if (record.country === this.country) {
      this.push(record);
    }
    cb();
  }
}
