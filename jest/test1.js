function func1(v) {
  console.log('func1 : ', v);
  let result = {};
  if (v) {
    console.log('true');
    result.error == false;
    result.a = 'aaaa';
    result.b = 'bbbb';
    result.c = 1111;
  } else {
    console.log('false');
    result.error = true;
  }
  return result;
}

module.exports = {
  func1,
};
