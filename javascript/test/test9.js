function run(strlist) {
  // return strlist.reduce((acc, cur) => {
  //   acc.push(cur.length);
  //   return acc;
  // }, []);

  // return strlist.reduce((acc, cur) => [...acc, cur.length], []);

  return strlist.map(v => v.length);
}

console.log(run(['We', 'are', 'the', 'world!']));
console.log(run(['i', 'love', 'javascript']));
