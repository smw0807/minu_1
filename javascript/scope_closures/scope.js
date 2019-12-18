//var, let, const test

// var a = "aa";
// var a = "a";
// a = "aaaa";
// console.log(a); //aaaa
//같은 변수로 선언하면 마지막껄로 됨

// let a = 'aa';
// let a = 'a'; //error
// a = 'aaaa';
// console.log(a);
//같은 변수로 선언 못함

// let a = 'aa';
// a = 'aaaa';
// console.log(a); //aaaa
//재정의는 할 수 있음

// const a = 'aa';
// const a = 'a'; //error
// a = 'aaaa';
// console.log(a);
//같은 변수로 선언 못함

// const a = 'aa';
// a = 'aaaa'; //error
// console.log(a);
//재정의 못함

//---------------------------------
//블록함수 확인
// {
//     var a = 'aa';
//     let b = 'bb';
//     const c = 'cc';
// }
// console.log(a);
// console.log(b);
// console.log(c);
//----------------------------------
function one () {
    const a = 'aaaaa';
    var b = 'bbbb';
};
function two () {
    one();
    // const b = 'bbbbbb';
    // console.log(a); //error
    console.log(b); 
};
// two();
//------------------------------
//함수 선언식 - 현재 스코프의 최상단으로 호이스팅됨(hoist)
test();
function test() {
    console.log('test');
}
test();
//test 둘다 실행됨
//------------------------------
//함수 표현식 - 현재 스코프의 최상단으로 호이스팅안됨
test1();
var test1 = function () {
    console.log('test1');
}
test1();
//첫번째에서 에러