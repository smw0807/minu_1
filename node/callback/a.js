function logToSnapErrors(err) {
  console.error(err);
}

function wrapLogging(cb) {
  return function (arg) {
    try {
      cb(arg);
    } catch (error) {
      logToSnapErrors(error);
    }
  };
}

const a = wrapLogging(run)('a');

a('kk'); //1. wrapLogging 안에 리턴 함수 인자(arg)로 kk 전달

function run(a) {
  console.log('run : ', a);
}
