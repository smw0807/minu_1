const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

const PORT = 8080;

app.get('/', (req, res) => {
  res.send('HTTPS server running!');
});

const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'), 'utf8');

const credentials = { key: privateKey, cert: certificate, passphrase: process.env.KEY_PASS };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
