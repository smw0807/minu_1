const mg = require('mongoose');
const userSchema = new mg.Schema({
  user_id: { type: String, require: true },
  user_pw: { type: String, require: true },
  user_nm: { type: String, require: true }
},
{
  collation: 'users'
})

module.exports = mg.model('users', userSchema);