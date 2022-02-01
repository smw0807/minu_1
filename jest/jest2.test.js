const { func1 } = require('./test1');
describe("테스트....", () => {
  test('1 + 1 = 2?', () => {
    expect(1 + 1).toBe(2);
  })

  //toBeUndefined
  test('예상한 값이 Undefined 인지 확인 ', () => {
    const a = {};
    expect(a.aa).toBeUndefined();
  })

  test('toBeTruthy ?', () => {
    const a = true;
    expect(a).toBeTruthy();
  })

  test('toEqual', () => {
    const a = false;
    expect(func1(a)).toEqual(obj.error);
  })
})