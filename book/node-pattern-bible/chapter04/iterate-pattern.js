const tasks = [
  { name: 'a', value: 0 },
  { name: 'b', value: 1 },
  { name: 'c', value: 2 },
  { name: 'd', value: 3 },
  { name: 'e', value: 4 },
  { name: 'f', value: 5 },
];

function iterate(index) {
  if (index === tasks.length) {
    return finish();
  }
  const task = tasks[index];
  console.log(`task : ${JSON.stringify(task)}`);
  iterate(index + 1);
  // task(() => iterate(index + 1));
}

function finish() {
  console.log('Iterate Finish!');
}

iterate(3);
