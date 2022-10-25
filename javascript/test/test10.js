function run(my_string) {
  // return [...my_string].reverse().reduce((a, b) => a.concat(b), '');
  return [...my_string].reverse().join('');
}

console.log(run('jaron'));
