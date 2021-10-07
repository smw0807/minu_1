const express = require('express');

const router = express.Router();
const es_client = require('../elastic');
const es_utils = require('../utils/utils');
const token = require('../utils/authenticate');

router.post('/login', async(req,res) => {

})

router.post('/refreshToken', async(req,res) => {

})

module.exports = router;