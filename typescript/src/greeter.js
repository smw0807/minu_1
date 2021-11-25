function greeter(person) {
    return "hello, " + person.firstName + " " + person.lastName;
}
var user = {
    firstName: 'Minwoo',
    lastName: 'Song'
};
document.body.textContent = greeter(user);
