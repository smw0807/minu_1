const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.locals.title = 'pug';
  res.locals.text = 'views engine pug!!';
  res.render('main');
  // res.render('main', {title: 'pug'});
})

module.exports = router;