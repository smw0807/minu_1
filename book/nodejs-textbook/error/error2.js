const fs = require('fs');

setInterval(() => {
  fs.unlink('./nofile', err => {
    if (err) {
      console.error(err);
    }
  })
}, 1000);