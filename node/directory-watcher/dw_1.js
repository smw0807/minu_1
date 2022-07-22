const dw = require('directory-watcher');

dw.create('./watcher', function (err, watcher)  {
  watcher.once('change', function(files) {
    console.log('will fire once', files);		
  });
  watcher.on('delete', function(files) {
      console.log('%s deleted', files);
  });
  watcher.on('add', function(files) {
      console.log('%s added', files);
  });

})