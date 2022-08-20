const logger = require('./export-class');
const dbLogger = new logger('DB');
const accessLogger = new logger('ACCESS');

dbLogger.log('log check');
dbLogger.info('info check');
dbLogger.verbose('verbose chechk');
console.log("--------------");
accessLogger.log('log check!!');
accessLogger.info('info check!!!');
accessLogger.verbose('verbose check!!!!');