const mg = require('mongoose');
const userSchema = new mg.Schema({
  user_id: { type: String, require: true },
  user_pw: { type: String, require: true },
  user_nm: { type: String, require: true }
});

userSchema.index({
  user_id: 1
})

module.exports = mg.model('users', userSchema);