/** private 변수와 클로저
 * 함수 내의 변수는 함수 바깥에서 접근할 수 없다.
 * 그 변수들은 접근할 수 없기 때문에, private 변수라고 불린다.
 * 하지만, 해당 변수들에 접근해야 할 필요가 종종 발생하는데, 클로저를 활용하면 가능함
 */

 function secret (code) {
     return {
         code1 () {
             console.log(code);
         }
     }
 }
 const tt = secret('aaaaaaaaaaaaaaaaaaaaaa');
 tt.code1();