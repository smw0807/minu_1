/**
 * 한번 이론 대충보고 써본건데 공부 더 필요 (소스도 간략하게 옮겨 적은거라 안되는거임ㅋ)
 */

var fieldList = [];
var getFieldList = function (index) {
    return new Promise(function (resolve, rj) {
        $http({method: "POST", url: '../es_rest/query', data: index}).then(function (rs) {
            if(rs) {
                fieldList = [];
                var text = rs.data.text;
                for(var i in text) {
                    fieldList.push(text[i].name);
                }
                resolve(fieldList);
            }
        });
    });
}
var index = "test";
getFieldList(index).then(function (rs) {
    callbackify(null, fieldList.map(function (val) {
        return {
            caption:val, value: val, meta: "field"
        }
    }));
});