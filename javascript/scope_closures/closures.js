/*
함수 내부에 함수를 만들 때 내부에 작성된 함수가 클로저.
클로저는 차후에 외부 함수의 변수를 사용할 수 있기 때문에 대개 반환하여 사용한다.
클로저는 외부 함수의 변수에 접근할 수 있기 때문에, 일반적으로 두가지 목적을 위해 사용한다.
1. 사이드 이펙트(side effects) 제어하기
2. private 변수 생성하기
*/

function outerFunction () {
    const outer = 'outer variable!!!';
    
    function innerFunction () {
        console.log(outer);
    };

    return innerFunction
}

outerFunction()();  // ()도 아니고 ()()로 해야 반환되는데 이유는 뭐임...?

function outerFunction1 () {
    const outer = 'outer variable!!!';
    
    function innerFunction () {
        console.log(outer);
    };

    return innerFunction() //이렇게하면
}

outerFunction1();  //() 이거로 해도 반환됨

