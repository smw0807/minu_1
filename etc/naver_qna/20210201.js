/**
 * 지식인 답변 달아보기
 * https://kin.naver.com/qna/detail.nhn?d1id=1&dirId=1040202&docId=380658624&qb=amF2YXNjcmlwdA==&enc=utf8&section=kin.qna.all&rank=1&search_sort=5&spq=0&mode=answer
 */
var change_color_text = ['spring', 'flowers', 'good', 'first']; //변환시킬 단어

var text = 'We have four seasons. The first is spring. Spring is the beginning. There are many flowers in spring. In spring I hope to go on a picnic. Spring is very good season.';

var front = '<span style="color:red">'; //글씨 색을 변환 시킬 html 시작 태그
var end = '</span>'; //글씨 색을 변활 시킬 html 종료 태그

for (var i in change_color_text) { //change_color_text에 들어있는 문자 배열만큼 for문 실행
    if(text.indexOf(change_color_text[i]) != -1) {  //단어가 있으면 실행
        var text_length = change_color_text[i].length; //단어의 길이
        var pos = text.indexOf(change_color_text[i]);  //단어의 위치
        var a = text.substr(0, pos); //단어 시작 전까지 끊기
        var b = text.substr(pos, text_length); //해당 단어 끊기
        var c = text.substr(pos + text_length, text.length); //해당 단어 이후 부터 끝까지 끊기
        text = a + front + b + end + c; //합치기
    }
}
console.log(text);

