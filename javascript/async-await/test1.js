function test1(params) {
  return new Promise ( (resolve, reject) => {
    console.log(params);
    reject(true);
  })
}


async function main() {
  try {
    const run = await test1('dddd');
    console.log(run);
  } catch (err) {
    console.error('Error : ', err);
  }
}

main();