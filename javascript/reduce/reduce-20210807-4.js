const promiseFactory = (time) => {
  return new Promise((resolve, reject) => {
    console.log(time); 
    setTimeout(resolve, time);
  });
};
[1000, 2000, 3000, 4000].reduce(async (acc, cur) => {
  await acc;
  return await promiseFactory(cur);
}, Promise.resolve());