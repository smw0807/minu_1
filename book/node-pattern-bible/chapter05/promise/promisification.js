function promisify(callbackBasedApi) {
  return function promisified(...args) {
    //1
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        //2
        function (err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        },
      ];
      callbackBasedApi(...newArgs); //3
    });
  };
}
