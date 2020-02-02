/**
 * 참고 URL : https://blueshw.github.io/2018/03/12/this/
 */
//bind, arrow function
//생성자 함수 안에 또 다른 함수가 있을 경우
function family (firstName) {
    this.firstName = firstName;
    const name = ['bill', 'mark', 'steve'];
    // name.map(function (lastName, index) { //서브 루틴이라 바깥의 this를 사용 못함
    //     console.log(lastName + ' ' + this.firstName);
    // });
    name.map((lastName, index) => { //arrow function사용하면 this사용 가능
        console.log(lastName + ' ' + this.firstName);
    });
};
const kims = new family('song');

const testObj = {
    outFt: function () {
        function inFt() {
            console.log(this);
        }
        inFt();
    }
}
// testObj.outFt();
/**
 * outFt가 외부에서 실행(testObj.outFt())되면 this는 testObj이다.
 * 그리고 outFt 내부에서 inFt가 호출할떄는 그 어떤 문맥도 지정하지(바인드되지) 않았다.
 * 전역 context(window)에서 실행되었다는 것.
 * 이게 바로 (비엄격모드에서) inFt의 this가 window가 되는 이유이다.
 */
