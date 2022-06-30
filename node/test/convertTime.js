function convertTime(d) {
  let result = null;
  const timeRegExp = d.match(/\d+/g);
  if (!timeRegExp) throw new Error('받은 값에 시간(숫자)이 없습니다.');

  const typeRegExp = d.match(/[h|m|s|y|M|w|d]/g);
  if (!typeRegExp) throw new Error('날짜/시간 구분값은 h,m,s,y,M,w,d 중 1개만 가능합니다.');
  if (typeRegExp.length > 1) throw new Error('날짜/시간 구분값은 1자리만 가능합니다.');

  const time = parseInt(timeRegExp.toString());
  const type = typeRegExp.toString();

  switch(type) {
    case 'h':
      result = time * 3600;
      break;
    case 'm':
      result = time * 60;
      break;
    case 's':
      result = time * 1;
      break;
    case 'y':
      result = time * 3600 * 24 * 365;
      break;
    case 'M':
      result = time * 3600 * 24 * 30;
      break;
    case 'w':
      result = time * 3600 * 24 * 7;
      break;
    case 'd':
      result = time * 3600 * 24 * 1;
      break;
  }
  return result;
}
const test = convertTime('1d');
