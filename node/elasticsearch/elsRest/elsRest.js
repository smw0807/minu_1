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
        console.log(err);
    }
    return rs;
}
//todo row

//todo indsert

//todo update

//todo delete