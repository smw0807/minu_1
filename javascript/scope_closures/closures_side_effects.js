/** 클로저로 사이드 이펙트 제어하기
 * 함수에서 값을 반환할 떄를 제외하고 무언가를 행할 때 사이드 이펙트가 발생한다.
 * 예)
 * 1. Ajax 요청
 * 2. timeout 생성
 * 3. console.log 선언
 * 등이 있다.
 */
function a (x) {
    console.log('this is side effects');
}

// function makeCake() {
//     setTimeout(_ => console.log('Made a cake'), 1000); //사이드 이펙트
// }
// makeCake();

//---------------------

// function makeCake(flavor) {
//     setTimeout(_ => console.log('Made a ' + flavor + ' cake!'), 1000);
// }
// makeCake('melon');

// function makeCake(flavor) {
//     setTimeout(_ => console.log('Made a ${flavor} cake!', 1000))
// }
// makeCake('banana');

//------------------------

function prepareCake (flavor) {
    return function a () {
        setTimeout(_ => console.log(`Made a ${flavor} cake!`), 1000);
    }
}
const makeCakeLater = prepareCake('banana');
makeCakeLater();