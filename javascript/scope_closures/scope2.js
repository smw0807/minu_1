//Nested scope
function a () {
    const tt= 'tt';

    function b () {
        const rr = 'rr';
        console.log(tt); //렉시컬 스코핑 (lexical scoping)
    }
    b();
    console.log(rr); //error
};
a();