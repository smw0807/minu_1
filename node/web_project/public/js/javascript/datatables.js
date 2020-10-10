console.log("check");
var json_data;
$(document).ready(function () {
});

var table = $('#data_table').DataTable({
    order: [[0, 'asc']],
    ajax: {
        url: 'json/json_test.json',
        dataSrc: '',
        data: function (data) {
            console.log(data);
        }
    },
    retrieve: true,
    jQueryUI: false,
    autoWidth: true,
    lengthChange: false,
    deferRender: true,
    paging: true,
    processing: true,
    serverSide: true,
    pageLength: 25,
    pagingType: "custom_simple_numbers",
    scrollY: "500px'",
    dom: 'z<"dt-toolbar"> t <"dt-toolbar-footer" <"pull-left"> <"pull-right"p>>',
    language: {
        zeroRecords: "데이터가 없습니다",
        lengthMenu: "<div class='pull-right'>_MENU_</div >",
        search: '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span> ',
        paginate: {first: "First", last: "Last", next: ">", previous: "<"}
    },
    columnDefs: [
        {targets: [0], width: '100px', class: 'text-center'},
        {targets: [1], width: '150px', class: 'text-left'},
        {targets: [2], width: '100px', class: 'text-left'},
        {targets: [3], width: '150px', class: 'text-center'},
    ],
    columns: [
        {data: "id", name: "id"},
        {data: "name", name: "name"},
        {data: "gender", name: "gender"},
        {data: "address", name: "address"}
    ]
});

async function getData() {
    console.log("getData");
    // json_data = await 
    var result = await getJson();
    console.log(result);
    table.rows.add(result);
};
getData
//json data 가져오기
function getJson() {
    return new Promise(function(resolve) {
        $.getJSON('json/json_test.json', function (data) {
            resolve(data.contacts);
        });
    });
}


