function runner() {
  try {
    console.log('hello');
    // throw new Error('error!!!');
    console.log('Code Factory');
  } catch (e) {
    console.log('----- catch -----');
    console.log(e);
  } finally {
    console.log('----- finally -----');
  }
}

runner();
