const mg = require('mongoose');
const bcrypt = require('bcryptjs');
// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mg.Schema({
  user_id: { type: String, require: true },
  user_pw: { type: String, require: true },
  user_nm: { type: String, require: true }
});

userSchema.index({
  user_id: 1
})

// userSchema.plugin(passportLocalMongoose, { usernameField: 'user_id', passwordField: 'user_pw'});

userSchema.methods.comparePassword = function(password, done) {
  console.log('method1 : ', password);
  console.log('method2 : ', this.user_pw);
  const compare = bcrypt.compareSync(password, this.user_pw);
  console.log('compare :' , compare);
  return done(null, true);
}

module.exports = mg.model('users', userSchema);