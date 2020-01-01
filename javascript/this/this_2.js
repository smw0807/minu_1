/**
 * 참고 URL : https://blueshw.github.io/2018/03/12/this/
 */
const person = {
    name: 'john',
    age: 29,
    nickName: 'man from earth',
    getName: function () {
        return this.name;
    }
};
console.log(person.name); //john
console.log(person.getName()); //john
console.log("-------------------------1");

const otherPerson = person;
console.log(otherPerson.name); //john
console.log(otherPerson.getName()); //john
console.log("--------------------------2");
otherPerson.name = 'chris';
console.log(person.getName()); //chris
console.log(otherPerson.getName()); //chris
/**
 * otherPerson.name을 chris로 설정한뒤 person.getName()을 호출하면 chris로 나오는데 
 * 이는 otherPerson이 person의 레퍼런스 변수이므로 하나를 변경하면 다른 하나도 변경됨.
 * 이를 피하기 위해서는 Object.assign() 메서드를 이용하여 완전히 별도의 객체로 만들어야함
 */
console.log("------ Object.assign() --------------");
person.name = 'john';
const newPerson = Object.assign({}, person);
newPerson.name = 'chris';
console.log(person.getName());
console.log(newPerson.getName());