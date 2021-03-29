//비구조화 할당 확인해보고 싶은거 테스트

const obj = {
  created() {
    console.log('created!!');
  },
  status: 200,
  sub: {
    a: 1,
    b: 'b',
    c() {
      console.log('sub/c!!');
    },
    d: {
      dd: 'dd'
    }
  }
}

const {created, status, sub: {a, b, c, d: {dd}}} = obj;

created();
console.log(status);
console.log(a);
console.log(b);
c();
console.log(dd);

const tt = obj.sub.d.dd;
console.log(tt);
