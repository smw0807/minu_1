function outFunc(name) {
    let value = 'out.....';
    console.log("1");
    function innerFunc() {
        console.log('2');
        return value + name
    };
    console.log('3');
    return innerFunc;
};

// var result = outFunc('woooooo');
// console.log(result());


// var out = 'out value';
// function outft () {
//     var inner = 'in value';

//     function inft (param) {
//         console.log('out : ' + out);
//         console.log('inner : ' + inner);
//         console.log('param : ' + param);
//     }
//     return inft;
// };

// var param = 'parammmmmmmmmmmmmm';
// var rs = outft(); //rs는 outft() 함수의 결과값으로, inft() 함수 자체를 참조하고 있음
// rs(param);


/**
 * outft()함수가 선언되었지만, 실제로 호출되기전까지 언제 사용될지 모름.
 * 해당 함수 (outft())의 클로저로써 유효범위(전역범위) 의 변수들이 클로저 객체로 메모리 상에 남아 있게 된다.
 * outft() 함수가 실행될 때 해당 함수 내부에서 outft() 바깥의 전역 영역의 변수에 접근할 수 있다.
 * outft() 내부에 inft()가 선언되는 순간 outft() 내의 변수(inner)가 inft() 함수의 클로저 객체 안에 존재하게 되는 것.
 * 그러고 나면 각각의 outft(), inft() 함수가 실제로 호출되어 실행되는 순간에 미리 메모리에 저장되어 있던 클로저에서 각각의 변수를 가져올 수 있게 된다.
 */


var out = 'out value';
function outft () {
    var inner = 'in value';

    function inft (param) {
        console.log('out : ' + out);
        console.log('inner : ' + inner);
        console.log('param : ' + param);
    }
    return inft;
};

var param = 'parammmmmmmmmmmmmm';
var rs = outft()(param); //rs는 outft() 함수의 결과값으로, inft() 함수 자체를 참조하고 있음



