/** //! arrow function 공부 (+메소드 정의)
 * 참고 URL : http://webframeworks.kr/tutorials/translate/arrow-function/
 * 서브 루틴 : 자신 그 자체로 존재하며 직접 호출된다. (일반적으로 함수라 표현 함)
 */

 var arr = ['a', 'b', 'c', 'd', 'e'];
 var obj = {
     myMethod: function () { //메소드
         setTimeout(function () {}, 1000); //서브루틴
     }
 }
 /**
  * 함수는 this라 불리는 특별한 변수를 가진다.
  * this는 메소드를 호출되는 객체를 참조한다. 
  * this는 동적으로 전달 받기 때문에 여기서의 this는 dynamic this로 불린다.
  * 
  * 함수는 서브루틴 실행으로는 잘 동작하지 않는다. (함수의 this는 동적이기 때문에)
  * 서브루틴 호출은 this를 전역 객체로 가지거나 엄격모드에서는 undefined로 셋팅된다.
  * 서브루틴은 서브루틴만의 this를 사용하지 않고, 그것을 둘러싸고 있는 메소드의 this를 참조한다.
  * 그래서 자체 this에 접근이 불가능하다.
  */
 var jane = {
     name: "Jane",
     logHello: function (friends) {
         var that = this; // (*)
         console.log("1");
         console.log(that);
         friends.forEach(function (friends) {  //forEach의 인수는 서브루틴임
             console.log("2");
             console.log(that.name + " says hello to " + friends);
         });
     }
 }
//  var test = jane.logHello(arr);

 /**
  * logHello dml this에 접근하기 위해서는 (*) 지점에서 보이는 별도의 선언이 필요함
  */

 var jane = {
    name: "Jane",
    logHello: function (friends) {
        friends.forEach(function (friends) {  //forEach의 인수는 서브루틴임
            console.lof(that.name + " says hello to " + friends);
        }.bind(this));
    }
 }
 //var test = jane.logHello();

  /**
   * 화살표 함수는 서브루틴을 정의할 때 일반 함수를 사용하는 것보다 훨씬 낫다.
   */
  let jane1 = {
      name: "Jane",
      logHello: function (friends) {
        friends.forEach(friends => {
            console.log(this.name + " says hello to " + friends);
        });
      }
  }
//   var test = jane1.logHello(arr);
/**
 * 인수에 대한 상세:
 * () => {...} //인수가 없을 때
 * x => {...} //인수가 하나일 때
 * (x, y) => {...} //인수가 여러 개일 때
 * 
 * 몸체에 대한 상세:
 * x => { return x * x } //블록을 사용
 * x => x * x //표현식, 위와 동일
 * 블록 내부는 일반 함수의 몸체처럼 동작한다. 예를 들어, 어떤 값을 반환해야할 때 return을 사용해야 한다.
 * 표현식을 사용하면 암묵적으로 항상 결과 값을 반환한다.
 * 표현식 몸체에 추가로 블록 몸체를 사용하는 것은 객체 리터럴로 표현식을 원하는 경우, 괄호를 붙여야 한다는 것을 의미한다.
 * 화살표 함수 표현식이 몸체를 얼마나 줄일 수 있는지를 비교해보자...
 */
// let squares = [1, 2, 3].map(function (x) {return x * x});
// let squares = [1, 2, 3].map(x => x * x);
// console.log(squares);

/** //! 화살표 함수 vs 일반 함수
 * 두 함수는 3가지 측면에서 다르다.
 * 1. 화살표 함수는 항상 바인딩 된 this를 가진다.
 * 2. 화살표 함수는 생성자로 사용할 수 없다. (Construct(new 키워드와 일반 함수가 함께 실행될 수 있게 해줌)라는 내부 메소드와 prototype 속성이 없기 때문)
 *    그러므로  new (() => {})는 에러를 반환한다.
 * 3. 화살표 함수는 ES6의 새로운 구조이기 때문에 새로운 방식의 인수 조작(기존 매개변수, 나머지 매개변수 등등)이 가능하고
 *    더이상 arguments 키워드를 지원하지 않는다.
 * 새로운 방식의 인수 조작으로 arguments로 했던 모든 것들이 가능하기 때문에 더이상 필요할 일이 없기 때문이다.
 * 이런 점들을 제외하고, 화살표 함수와 일반 함수의 외적 차이는 없다. 예를 들어, typeof와 instanceof는 예전처럼 사용할 수 있다.
 */
var test1 = {
    one: (a) => {
        console.log("one!!");
        var data = a * 1;
        return data;
    },
    two: (a) => {
        console.log("two!!");
        var data = a * 2;
        return data;
    },
    tree: (a) => {
        console.log("tree!!");
        var data = a * 3;
        return data;
    }
}
// console.log(test1.one(1));
// console.log(test1.two(2));
// console.log(test1.tree(3));

let objectCreator = {
    create: function (secret) {
        console.log("11");
        console.log(secret); //xyz
        return {
            secret: secret,
            getSecret: () => {
                console.log("22");
                console.log(secret); //xyz
                console.log(this.secret); //abc
                console.log("??");
                // return this.secret;
                return secret;
            }
        }
    },
    secret: "abc"
}
// let objj = objectCreator.create("xyz");
// console.log(objj.getSecret());
// let func = objj.getSecret;
// console.log(func());

let janee = {
    name: "Jane",
    logHello(friends) {
        friends.forEach(friends => {
            console.log(this.name + " says hello to " + friends);
        });
    }
}
// console.log(janee.logHello(arr));