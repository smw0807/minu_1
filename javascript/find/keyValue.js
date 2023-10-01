const urls = [{ 'a.png': 'a.com' }, { 'b.png': 'b.com' }, { 'c.png': 'c.com' }];

const file = 'b.png';

const url = urls.find(v => v[file]);
console.log('url : ', url);
console.log(Object.keys(url)[0]);
console.log(url[file]);
