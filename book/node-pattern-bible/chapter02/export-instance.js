class Logger {
  constructor(name) {
    this.count = 0;
    this.name = name;
  }
  log(message) {
    this.count++;
    console.log('[' + this.name + '] ' + message, this.count);
  }
}

module.exports = new Logger('DEFAULT');