console.log('test4');

function callParent () {
    console.log("부모창에 있는 함수 call 호출");
    var msg = $('#sendMsg').val();
    if (msg == '') {
        alert('input창에 텍스트를 입력해주시기 바랍니다.');
        return;
    }
    opener.call(msg);
    window.close();
};
