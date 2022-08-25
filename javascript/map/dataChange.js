const myTree = [
  {
    index: 0,
    branch: 'a',
    select: false,
    isUse: 'ok',
    title: 'hi111',
    content: 'hihi',
  },
  {
    index: 1,
    branch: 'a',
    select: false,
    isUse: 'ok',
    title: 'hi222',
    content: 'hihi',
  },
  {
    index: 2,
    branch: 'a',
    select: false,
    isUse: 'ok',
    title: 'hi333',
    content: 'hihi',
  },
];

function change(idx) {
  return myTree.map((v, k) => {
    if (k === idx) v.select = true;
    else v.select = false;
  });
}
change(1);
