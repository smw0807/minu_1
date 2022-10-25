function run(age) {
  // const yyyy = new Date().getFullYear() + 1;
  // return yyyy - age;
  return new Date().getFullYear() - age + 1;
}

console.log(run(23));
