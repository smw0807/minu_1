class Person {
  constructor(name) {
    this._name = name;
    this._courses = [];
  }
  get name() { return this._name; }
  get courses() { return this._courses; }
  set courses(aList) { this._courses = aList; }

  addCourse(aCourse) {
    this._courses.push(aCourse);
  }
  removeCourse(aCourse, fnIfAbsent = () => { throw new RangeError(); }) {
  // removeCourse(aCourse) {
    const index = this._courses.indexOf(aCourse);
    if (index === -1) fnIfAbsent();
    else this._courses.splice(index, 1);
    // this._courses.splice(index, 1);
  }
}

class Course {
  constructor(name, isAdvanced) {
    this._name = name;
    this._isAdvanced = isAdvanced;
  }
  get name() { return this._name; }
  get isAdvanced() { return this._isAdvanced; }
}

const dataSet = {
  "name":"송민우",
  "courses":[
    "a", "b", "c", "d", "e", "f"
  ]
}

const person = new Person(dataSet.name);
person.courses = dataSet.courses;
console.log(person.name, person.courses);
person.removeCourse("c");
// person.removeCourse("h"); //RangeError
console.log(person.name, person.courses);
person.addCourse("aaa");
console.log(person.name, person.courses);
console.log("-#------------------#-");
const aPerson = new Person(dataSet.name);
for (const name of dataSet.courses) {
  // console.log(name);
  aPerson.addCourse(new Course(name, false));
}