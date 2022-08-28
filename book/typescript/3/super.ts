class Person1 {
  constructor(
    public firstName: string,
    public lastName: string,
    private age: number
  ) {} //슈퍼 클래스의 생성자
}
class Employee1 extends Person1 {
  constructor(
    //서브클래스 Employee1의 생성자
    firstName: string,
    lastName: string,
    age: number,
    public department: string
  ) {
    super(firstName, lastName, age); //슈퍼 클래스 생성자를 호출한다.
  }
}

const empl = new Employee1('Joe', 'Smith', 29, 'Acoounting'); //서브클래스를 인스턴스 생성한다.
