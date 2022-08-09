function a(name, code) {
  console.log('name : ', name);
  console.log('code : ', code);
}

const aName = 'smw';
const aCode = 1;

a(aName, aCode);
console.log("-------");
a`${aName} ${aCode}`;