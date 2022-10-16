const mg = require('mongoose');
const moment = require('moment');

const GuestBookSchema = new mg.Schema({
  user_nm: { type: String, require: true },
  comments: { type: String, require: true },
  createDt: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },
});

module.exports = mg.model('guestbook', GuestBookSchema);
