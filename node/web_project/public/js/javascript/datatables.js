console.log("check");
var table;
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

async function drawTable() {
    var result = await getJson();
    console.log(result);
    table = $('#data_table').DataTable({
       order: [[0, 'asc']],
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