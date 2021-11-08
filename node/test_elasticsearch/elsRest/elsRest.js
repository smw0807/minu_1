var client = require('./client');

//count 구하는거
exports.getCount = async function (idx) {
    var param = {
        index: idx
    };
    let rs;
    try {
         rs = await client.count(param);
    } catch (err) {
        console.log('error!!');
        console.log(err);
        rs = err;
    }
    return rs;
};

//todo Search
exports.search = async function (idx, query) {
    var param = {
        index: idx,
        type: '_doc',
        body: query
    };
    let rs;
    try {
        rs = await client.search(param);
        rs = rs.hits.hits;
    } catch (err) {
        console.log('error!!');
        // console.log(err);
        rs = err;
    }
    return rs;
}
//todo row
exports.row = async function (idx, id) {
    const index = idx;
    const _id = id;
    let rs;
    var param = {
        index: index,
        type: '_doc',
        id: _id
    };
    try {
        rs = await client.get(param);
    } catch (err) {
        console.log('error!!');
        // console.log(err);
        rs = err;
    }
    return rs;
};

//todo indsert
exports.insert = async function (idx, data) {
    let rs;
    //data
    let user_id = data.user_id;
    let user_nm = data.user_nm;
    let user_pw = data.user_pw;
    let user_email = data.user_email;
    let user_tel = data.user_tel;
    let user_hp = data.user_hp;
    let user_mk_dt = data.user_mk_dt;
    //id 중복체크
    let chk = {
        index: idx,
        type: '_doc',
        body: {query: {term: {USER_ID: user_id}}}
    };
    var cnt = await client.count(chk);
    if (cnt.count != 0) {
        rs = false;
    } else {
        var param = {
            index: idx,
            type: '_doc',
            id: user_id,
            body: {
                USER_ID: user_id,
                USER_NM: user_nm,
                USER_PW: user_pw,
                USER_EMAIL: user_email,
                USER_TEL: user_tel,
                USER_HP: user_hp,
                USER_MK_DT: user_mk_dt,
                IS_USE: true
            }
        };
        try {
            rs = await client.create(param);
        } catch (err) {
            console.log("error!!");
            rs = err;
        }
    }
    return rs;
};

//todo update
exports.update = async function (idx, id, data) {
    let rs;
    
}

//todo delete