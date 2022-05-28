const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('user');
})

//주소는 같고 메서드가 다를 경우
router.route('/info')
  .get((req, res) => {
    res.send('GET /user/info');
  })
  .post((req, res) => {
    res.send('POST /user/info');
  })

module.exports = router;