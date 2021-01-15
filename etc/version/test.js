let version = 'v1';
let gAction = {
    list : `../${version}/board/list`,
    row : `../${version}/board/row`
}

let test = function () {
    $.ajax({
        url: gAction.list,
        type: 'GET',
    });
}
console.log(gAction.list);

/**
 * url 요청을 통한 로직을 처리할 때 버전을 넣어서 관리하는 쪽으로 생각해보자.
 * 큰 변화가 생기는 작업이 생기거나, 특정 상황에 맞춰 사용한다던가 등
 * 고려해볼 만한 상황은 충분히 많을 것 같다.
 * 머리속에 생각은 되어있는데 정리가 안돼서 글로 작성을 못하겠네
 */