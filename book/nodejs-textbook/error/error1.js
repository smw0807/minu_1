setInterval(() => {
  console.log('start!!');
  try {
    throw new Error('Error!!!!!!!');
  } catch (err) {
    console.error(err);
  }
}, 1000);