/**
 * 표준 입력에서 읽고 모든 것을 표준 출력으로 다시 echo
 */
process.stdin
  .on('readable', () => {
    let chunk;
    console.log('New data available');
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}`);
    }
  })
  .on('end', () => console.log('End of stream'));
