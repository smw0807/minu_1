var table;
var table2;
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