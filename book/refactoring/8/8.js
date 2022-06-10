function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  let firstLine = true;
  const result = [];
  for (const line of lines) {
    if (firstLine) {
      firstLine = false;
      continue;
    }
    if (line.trim() === '') continue;
    const record = line.split(',');
    if (record[i].trim() === 'India') {
      result.push({
        city: record[0].trim(),
        phone: record[2].trim()
      })
    }
  }
  return result;
}
// 위 코드를 파이프라인으로 변경하기
/**
 * 반복문에서 사용하는 컬렉션을 가리키는 별도 변수를 새로 만들기
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  let firstLine = true;
  const result = [];
  const loopItems = lines;
  for (const line of loopItems) {
    if (firstLine) {
      firstLine = false;
      continue;
    }
    if (line.trim() === '') continue;
    const record = line.split(',');
    if (record[i].trim() === 'India') {
      result.push({
        city: record[0].trim(),
        phone: record[2].trim()
      })
    }
  }
  return result;
}

/**
 * if문의 첫 조건이 csv 데이터의 첫 줄을 건너 뛰는 역할이다. 
 * slice()로 변경하고 if문을 제거
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = [];
  const loopItems = lines.slice(1);
  for (const line of loopItems) {
    if (line.trim() === '') continue;
    const record = line.split(',');
    if (record[i].trim() === 'India') {
      result.push({
        city: record[0].trim(),
        phone: record[2].trim()
      })
    }
  }
  return result;
}

/**
 * 반복문에서 빈 줄 지우기(trim)은 filter로 대체한다.
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = [];
  const loopItems = lines.slice(1).filter(line => line.trim() !== '');
  for (const line of loopItems) {
    const record = line.split(',');
    if (record[i].trim() === 'India') {
      result.push({
        city: record[0].trim(),
        phone: record[2].trim()
      })
    }
  }
  return result;
}

/**
 * map을 사용해 여러 줄짜리 csv 데이터를 문자열 배열로 변환한다.
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = [];
  const loopItems = lines
            .slice(1)
            .filter(line => line.trim() !== '')
            .map(line => line.split(','));
  for (const line of loopItems) {
    const record = line;
    if (record[i].trim() === 'India') {
      result.push({
        city: record[0].trim(),
        phone: record[2].trim()
      })
    }
  }
  return result;
}

/**
 * 다시 filter를 사용해 특정 데이터를 뽑는다.
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = [];
  const loopItems = lines
            .slice(1)
            .filter(line => line.trim() !== '')
            .map(line => line.split(','))
            .filter(record => record[1].trim() === 'India');
  for (const line of loopItems) {
    const record = line;
    result.push({
      city: record[0].trim(),
      phone: record[2].trim()
    })
  }
  return result;
}

/**
 * map을 이용해 결과 레코드를 생성한다.
 */
 function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = [];
  const loopItems = lines
            .slice(1)
            .filter(line => line.trim() !== '')
            .map(line => line.split(','))
            .filter(record => record[1].trim() === 'India')
            .map(record => ({city: record[0].trim, phone: record[2].trim()}));
  for (const line of loopItems) {
    const record = line;
    result.push(line);
  }
  return result;
}


/**
 * 파이프라인에서 결과를 누적 변수에 넣게 해주고
 * 반복문을 제거한다.
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  const result = lines
            .slice(1)
            .filter(line => line.trim() !== '')
            .map(line => line.split(','))
            .filter(record => record[1].trim() === 'India')
            .map(record => ({city: record[0].trim, phone: record[2].trim()}));
  return result;
}

/**
 * 
 */
function acquireData(input) {
  const lines = input.split('\n'); //컬렉션
  return lines
        .slice  (1)
        .filter (line => line.trim() !== '')
        .map    (line => line.split(','))
        .filter (record => record[1].trim() === 'India')
        .map    (record => ({city: record[0].trim, phone: record[2].trim()}));
}