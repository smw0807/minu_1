const assert = require('assert');

const obj1 = {
    a: {
        b: 1
    }
};

const obj2 = {
    a: {
        b: 2
    }
};

const obj3 = {
    a: {
        b: 1
    }
};

const obj4 = Object.create(obj1);

assert.deepEqual(obj1, obj1); //이상없음

// assert.deepEqual(obj1, obj2);
//AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj2, ["서로 같지 않음"]);
// AssertionError [ERR_ASSERTION]: 서로 같지 않음

assert.deepEqual(obj1, obj3); //이상없음

