const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const app = express();
const port = 5001;

// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/set', require('./routes/set'));
app.use('/api/get', require('./routes/get'));

app.listen(port, () => console.log(`Server listening on port ${port}`));