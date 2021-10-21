const elastic = require('elasticsearch');
const aRoot = require('app-root-path');
require('dotenv').config({
  path: aRoot + '/.env'

});
const es_client = new elastic.Client({
  host: process.env.ES_HOST
})

module.exports = es_client;