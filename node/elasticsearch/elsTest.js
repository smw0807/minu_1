const els = require('./elsRest/elsRest');
const query = require('./query/userQuery');

async function count (idx) {
    var cnt = await els.getCount(idx);
    console.log(cnt);
}
// count('user');
var obj = [];
async function search (idx, query) {
    var rs = await els.search(idx, query);
    rs.forEach(function (v, k) {
        console.log(k);
        console.log(v);
        obj.push(v._source);
    })
    console.log(obj);
};
search('user', query.search);
