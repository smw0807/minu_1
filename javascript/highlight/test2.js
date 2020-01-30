/**
 * textarea 안에다가는 <span></span> 같은 태그를 집어 넣을 수 없기 때문에 div로 하이라이트 처리해야함
 * textarea를 hide 처리해놓고 데이터를 넣은 다음에 하이라이트 작업을 해주고 div에다 뿌리는 방식으로 해야함...
 * 필요 : textarea 값, 넣을 태그 시작과 끝, 위치
 */
var pos = "11 22";
var str = el.find('#TW_PATTERN_STR_str').val();

var ps = pos.split(" ");

str = str.substring(0, ps[0]) + '<span style="background-color:#e25d5d;">' + str.substring(ps[0], ps[1]) + '</span>' + str.substring(ps[1], str.length);

el.find('#TW_PATTERN_STR_string').val(str);
