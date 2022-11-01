/**
 * https://school.programmers.co.kr/learn/courses/30/lessons/120824
 * 정수가 담긴 리스트 num_list가 주어질 때, 
 * num_list의 원소 중 짝수와 홀수의 개수를 담은 배열을 return 하도록 solution 함수를 완성해보세요.
입출력 예 #1
[1, 2, 3, 4, 5]에는 짝수가 2, 4로 두 개, 홀수가 1, 3, 5로 세 개 있습니다.

입출력 예 #2
[1, 3, 5, 7]에는 짝수가 없고 홀수가 네 개 있습니다.
 */

function solution(num_list) {
  return [num_list.filter(v => v % 2 === 0).length, num_list.filter(v => v % 2 !== 0).length];
}

console.log(solution([1, 2, 3, 4, 5]));
console.log(solution([1, 3, 5, 7]));
console.log('---------');

//다른 분의 풀이 중 인상깊었던 것
function sol(num_list) {
  var answer = [0, 0];

  for (let a of num_list) {
    answer[a % 2] += 1;
  }
  return answer;
}

console.log(sol([1, 2, 3, 4, 5]));
console.log(sol([1, 3, 5, 7]));
