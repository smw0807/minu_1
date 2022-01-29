const run = require('./run_check_index');


describe('exists index test', function() {
  test('idx_file', () => {
    expect(run('idx_file'));
  })
  test('idx_file2', () => {
    expect(run('idx_file2'));
  })
  test('idx_file3', () => {
    expect(run('idx_file3', '2022', '2022', 'YYY')).equal(false);
    // expect(run('idx_file3', '2022', '2022', 'YYY').equal('idx_file3-2022'));
  })
}) 