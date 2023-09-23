function createTask(target, ...args) {
  return () => {
    target(...args);
  };
}

function run(name, age) {
  console.log(`My name is ${name} and ${age} years old.`);
}
const 클로저 = createTask(run, 'minwoo', '32');
클로저();

console.log('---------');

const 바인드 = run.bind(null, 'minwoo', '32');
바인드();
