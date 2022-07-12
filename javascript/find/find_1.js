const user = { 
  name: 'minwoo',
  nickName: 'Gkariss'
}

const users = [
  {
    name: 'minu',
    nickName: 'minu0807'
  }
]
console.log(users);
users.push(user);
console.log(users);


const hasUser = users.find(x => x.nickName === user.nickName);
console.log(hasUser)
if (hasUser) console.log('이미 있음');