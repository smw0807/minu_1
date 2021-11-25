interface Person {
  firstName : string;
  lastName : string;
}
function greeter (person: Person) {
  return "hello, " + person.firstName + " " + person.lastName;
}

let user = { 
  firstName : 'Minwoo',
  lastName : 'Song'
};

document.body.textContent = greeter(user);