const { Client } = require('elasticsearch');
require('dotenv').config();

const hosts = String(process.env.es_hosts)
  .split(',')
  .map(url => {
    const splitUrl = url.split('://');
    const protocol = splitUrl[0];
    const host = splitUrl[1];
    const user = process.env.es_user;
    const pass = process.env.es_pass;
    return `${protocol}://${user}:${pass}@${host}`;
  });

const es_client = new Client({
  hosts,
  requestTimeout: 180 * 1000,
  log: [
    {
      type: 'stdio',
      levels: process.env.es_log ? JSON.parse(process.env.es_log) : [] // change these options
    }
  ]
});

module.exports = es_client;
