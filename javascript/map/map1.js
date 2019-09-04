var col_data = new Map();

for (var i in aData) {
    col_data.put(aData[i].id, aData[i]);
}

columns.forEach(function (value, key) {
    var data = col_data.get(value.id);
});
//흠
