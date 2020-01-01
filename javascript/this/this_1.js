/**
 * 참고 URL : https://blueshw.github.io/2018/03/12/this/
 */
function NewObject(name, color) {
    this.name = name;
    this.color = color;
    this.isWindow = function () {
        // return this; // => NewObject { name: 'nana', color: 'yellow', isWindow: [Function] }
        return this == {}; // => false
    }
}

const obj = new NewObject('nana', 'yellow');
console.log(obj.name);
console.log(obj.color);
console.log(obj.isWindow());
/**
 * new 키워드로 새로운 객체를 생성했을 경우 생성자 함수 내의 this는 new를 통해 만들어진 새로운 변수가 된다.
 */

const obj = NewObject('nana', 'yellow');
// console.log(obj.name); //undefined
// console.log(obj.color); //undefined
// console.log(obj.isWindow()); //undefined
/**
 * new 키워드가 없으면 일반적인 함수 실행과 동일하게 동작하므로, NewObject 함수내의 this는 window 객체가 된다.
 */