var table;
var table2;
var table3;
var json_data;

$(document).ready(function () {
});

//json data 가져오기
function getJson() {
    return new Promise(function(resolve) {
        $.getJSON('json/json_test.json', function (data) {
            resolve(data.contacts);
        });
    });
}
//table 그리기
async function drawTable() {
    var result = await getJson();
    table = $('#data_table').DataTable({
       order: [0, 'asc'],
       data: result,
       scrollY: 385,
       columns: [
           {data: 'id'},
           {data: 'name'},
           {data: 'gender'},
           {data: 'address'}
       ]
   });
}
drawTable();

//data_table2 그리기
async function drawTable2() {
    var result = await getJson();
    table2 = $('#data_table2').DataTable({
        order: [1, 'asc'],
        data: result,
        scrollY: 385,
        columns: [
            {data: 'id'},
            {data: 'name'},
            {data: 'gender'},
            {data: 'address'}
        ],
        createdRow: function (row,data,idx) {
            var html = '<a href="javascript:;" onClick="call('+idx+')">' + data.name + '</a>';
            $('td:eq(1)', row).html(html);
        }
    });
};
drawTable2();

//idx data 보기
function call (idx) {
    var data = table2.row(idx).data();
    alert(JSON.stringify(data));
};

async function drawTable3() {
    var result = await getJson();
    tabe3 = $('#data_table3').DataTable({
        order: [0, 'asc'],
        data: result,
        scrollY: 385,
        columns: [
            {data: 'id'},
            {data: 'name'},
            {data: 'gender'},
            {data: 'address'}
        ]
    });
}
drawTable3();

//data 추가
function addRow() {
    console.log('addRow');
    var id = $('#id').val();
    var name = $('#name').val();
    var gender = $('#gender').val();
    var address = $('#address').val();
    if (id == '') {
        alert('id를 입력해주세요.');
        $('#id').focus();
        return;
    }
    if (name == '') {
        alert('name을 입력해주세요.');
        $('#name').focus();
        return;
    }
    if (gender == '') {
        alert('gender를 입력해주세요.');
        $('#gender').focus();
        return;
    }
    if (address == '') {
        alert('address를 입력해주세요.');
        $('#address').focus();
        return;
    }
    var param = {
        id: id,
        name: name,
        gender: gender,
        address: address
    };
    table3 = $('#data_table3').DataTable();
    table3.row.add(param).draw(false);
};