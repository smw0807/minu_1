const mg = require('mongoose');

const testDataSchema = new mg.Schema({
  sendDateTime: {type: Date},
	detectionDateTime: {type: Date},
	institutionCode: {type: String},
	institutionName: {type: String},
	equipCode: {type: String},
	equipIp: {type: String},
	packetSize: {type: Number},
	attackIp: {type: String},
	attackPort: {type: Number},
	victimIp: {type: String},
	victimPort: {type: Number},
	protocol: {type: Number},
	detectionRuleName: {type: String},
	payload: {type: String},
	detectionCount: {type: Number}
},
{ collection: 'testData'}); //collection 명칭 지정

testDataSchema.index({
  institutionCode:1,
  institutionName:1,
  equipCode:1,
  equipIp:1,
  attackIp:1,
  victimPort:1,
  protocol:1,
  detectionRuleName:1,
  payload:1,
  detectionCount:1
});

testDataSchema.statics.bulkInsert = function (models, fn) {
  if (!models || !models.length)
    return fn(null);

  let bulk = this.collection.initializeOrderedBulkOp();

  if (!bulk)
    return fn('bulkInsertModels: MongoDb connection is not yet established');

  let model;
  for (var i=0; i<models.length; i++) {
    model = models[i];
    bulk.insert(model);
  }
  bulk.execute(fn);
};

module.exports = mg.model('testData', testDataSchema);