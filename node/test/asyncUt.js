const { exec } = require('child_process');

exports.exec = function (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        //console.warn(error);
      }

      resolve(stderr ? stderr : stdout);
    });
  });
};

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

exports.sleep = async function (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
};
