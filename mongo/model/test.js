const mg = require('mongoose');

const testSchema = new mg.Schema({
  test_id: { type: String },
  test_pass: { type: String },
  test_name: { type: String }
});
testSchema.index({test_id:1});

module.exports = mg.model('test', testSchema);
