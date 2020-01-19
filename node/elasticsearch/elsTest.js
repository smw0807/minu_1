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
//search('user', query.search);

async function getRow (idx, id) {
    var row = await els.row(idx, id);
    console.log(row);
};
// getRow('user', 'smw0807');

async function insert (idx, data) {
    var rs = await els.insert(idx, data);
    if (!rs) {
        console.log("이미 존재하는 아이디 입니다.");
    } else {
        console.log(rs);
    }
    // console.log(rs);
}
var data = {
    user_id: "minu0807",
    user_nm: "송민우",
    user_pw: "123123",
    user_email: "smw0807@naver.com",
    user_tel: "02-1234-1234",
    user_hp: "010-1234-1234",
    user_mk_dt: "2020-01-19 19:03:11+0900",
    is_use: true
}
// insert('user', data);
