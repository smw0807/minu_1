const user = {
  id: 'smw0807',
  name: 'minwoo',
  gender: 'male',
  email: 'smw0807@gmail'
}

function test1(user) {
  console.log(user.id);
  console.log(user.name);
}

function test2({id, name}) {
  console.log(id);
  console.log(name);
}

test1(user);
test2(user);