function createPerson(name) {
  const privateProperties = {};

  const person = {
    setName(name) {
      if (!name) {
        throw new Error('A person must have a name');
      }
      privateProperties.name = name;
    },
    getName() {
      return privateProperties.name;
    },
  };
  person.setName(name);
  return person;
}

const person = createPerson('minwoo');
console.log(person);
console.log(person.getName());
person.setName('song');
console.log(person.getName());
