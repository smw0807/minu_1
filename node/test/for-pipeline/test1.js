/**
 * 데이터 50만개를 가져온 후
 * 그 중에 특정 조건의 데이터로 추려된 뒤
 * 해당 데이터에서 일부 필드만 가져오기...
 * 
 *  for문 한번으로 처리하는 속도와 filter, map을 이용한 파이프라인 형식으로 처리 속도를 확인해보고 싶어서 만들어봄.
 * 
 * 궁금한 이유는
 * filter나 map 둘다 객체를 순환하는건데 그럼 2번 순환해서 느리지 않을까? 라는 생각으로 진행해봄
 * 
 * 그리고 추가적으로 for문을 두번 돌려서 
 * 한 번은 특정 데이터 뽑기
 * 한 번은 뽑은 데이터에서 특정 필드만 넣기
 * 이것도 리팩터링 책에서 한 객체를 for문을 두 번 돌린다고 큰 영향은 없다고해서 확인해보고 싶어서 해봄.
 */

const es_client = require('./elastic');

// 데이터 가져오는 함수
async function getData() {
  try {
    const query = {
      "size":10000,
      "query":{
        "term":{
          "type":"flw"
        }
      }
    }
    let rs = await es_client.search({
      index: process.env.index_name,
      body: query,
      scroll: '1m'
    })
    let count = 0;
    const data = [];
    while(count < 50000) {
      count += rs.hits.hits.length;
      rs.hits.hits.reduce( (acc, doc, idx) => {
        acc.push(doc._source);
        return acc;
      }, data);
      rs = await es_client.scroll({ scrollId: rs._scroll_id, scroll: '1m'});
    }
    return data;
  } catch (err) {
    console.error('getData Error : ', err);
  }
}

/**
 * for문 한번에 특정 데이터만 배열에 특정 필드 넣기
 */
async function forTest() {
  try {
    const result = [];
    const data = await getData();
    console.time('forTest');
    console.log('forTest data.length : ', data.length);
    for (let item of data) {
      if (item.dir === 1) {
        result.push({
          create_date: item.create_date,
          time_start: item.time_start,
          time_end: item.time_end
        })
      }
    }
    console.log('forTest result length : ', result.length);
    console.timeEnd('forTest');
  } catch (err) {
    console.error(err);
  }
}


/**
 * 파이프라인 방식
 * filter로 특정 데이터를 추출하고, map을 이용해 특정 필드만 넣어줌
 */
async function pipelineTest() {
  try {
    const data = await getData();
    console.time('pipelineTest');
    console.log('pipelineTest data.length : ', data.length);
    const result = data.filter(x => x.dir === 1).map( item => {
      return {
        create_date: item.create_date,
        time_start: item.time_start,
        time_end: item.time_end
      }
    })
    console.log('pipelineTest result length : ', result.length);
    console.timeEnd('pipelineTest');
  } catch (err) {
    console.error(err);
  }
}


/**
 * for문 두번 사용해서 처리하기
 * 첫 번째 for문에 특정 데이터를 추출하고
 * 두 번째 for문에 추출된 데이터에서 특정 필드만 넣어줌
 */
async function forNfor() {
  try {
    const result = [];
    const data = await getData();
    console.time('forNfor');
    console.log('forNfor data.length : ', data.length);
    const tmp = [];
    for (let item of data) {
      if (item.dir === 1) {
        tmp.push(item);
      }
    }
    for (let item of tmp) {
      result.push({
        create_date: item.create_date,
        time_start: item.time_start,
        time_end: item.time_end
      })
    }
    console.log('forNfor result length : ', result.length);
    console.timeEnd('forNfor');
  } catch (err) {
    console.error(err);
  }
}

forTest();
pipelineTest();
forNfor();

/**
 * 첫 실행 결과
pipelineTest data.length :  500000
pipelineTest result length :  470460
pipelineTest: 188.445ms
forTest data.length :  500000
forTest result length :  470460
forTest: 120.63ms
forNfor data.length :  500000
forNfor result length :  470460
forNfor: 150.945ms
 */

/**
 * 두 번째 실행 결과
forTest data.length :  500000
forTest result length :  470460
forTest: 106.795ms
forNfor data.length :  500000
forNfor result length :  470460
forNfor: 165.224ms
pipelineTest data.length :  500000
pipelineTest result length :  470460
pipelineTest: 127.374ms
 */

/**
 * 세 번째 실행 결과
forTest data.length :  500000
forTest result length :  470460
forTest: 107.754ms
pipelineTest data.length :  500000
pipelineTest result length :  470460
pipelineTest: 159.283ms
forNfor data.length :  500000
forNfor result length :  470460
forNfor: 150.979ms
 */

/**
 * 네 번째 실행 결과
forTest data.length :  500000
forTest result length :  470460
forTest: 120.564ms
pipelineTest data.length :  500000
pipelineTest result length :  470460
pipelineTest: 161.398ms
forNfor data.length :  500000
forNfor result length :  470460
forNfor: 174.012ms
 */

/**
 * 다섯 번째 실행 결과
pipelineTest data.length :  500000
pipelineTest result length :  470460
pipelineTest: 164.288ms
forTest data.length :  500000
forTest result length :  470460
forTest: 91.212ms
forNfor data.length :  500000
forNfor result length :  470460
forNfor: 152.408ms
 */

//5만개로 했을 때 결과
/*
forTest data.length :  50000
forTest result length :  47434
forTest: 47.699ms
pipelineTest data.length :  50000
pipelineTest result length :  47434
pipelineTest: 42.945ms
forNfor data.length :  50000
forNfor result length :  47434
forNfor: 48.807ms

forTest data.length :  50000
forTest result length :  47434
forTest: 52.445ms
forNfor data.length :  50000
forNfor result length :  47434
forNfor: 53.992ms
pipelineTest data.length :  50000
pipelineTest result length :  47434
pipelineTest: 48.49ms

forNfor data.length :  50000
forNfor result length :  47434
forNfor: 59.962ms
forTest data.length :  50000
forTest result length :  47434
forTest: 45.359ms
pipelineTest data.length :  50000
pipelineTest result length :  47434
pipelineTest: 113.549ms

forTest data.length :  50000
forTest result length :  47434
forTest: 43.675ms
pipelineTest data.length :  50000
pipelineTest result length :  47434
pipelineTest: 46.917ms
forNfor data.length :  50000
forNfor result length :  47434
forNfor: 56.644ms

forTest data.length :  50000
forTest result length :  47434
forTest: 37.513ms
pipelineTest data.length :  50000
pipelineTest result length :  47434
pipelineTest: 45.834ms
forNfor data.length :  50000
forNfor result length :  47434
forNfor: 49.511ms
*/