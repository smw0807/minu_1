console.log('test3');
var popup;
function openWindow() {
    console.log("openWindow");
    popup = window.open('/test4', 'test', 'width=1024,height=700','_blank');
};


window.call = function (data) {
    console.log("자식창에서 호출");
    console.log(data);
    var msg = '자식창에서 입력한 값 :\n' + data;
    $('#inputPre').html(data);
};