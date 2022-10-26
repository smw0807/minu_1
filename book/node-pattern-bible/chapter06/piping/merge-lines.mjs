import { createReadStream, createWriteStream } from 'fs';
import split from 'split';

const dest = process.argv[2]; //목적지
const sources = process.argv.slice(3); //읽을 파일명들 배열로 담기

//목적지 스트림
const destStream = createWriteStream(dest);

let endCount = 0;
for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 16 });
  //모든 소스 스트림을 읽은 경우에만 목적지 스트림이 종료하도록 end 리스너 추가
  sourceStream.on('end', () => {
    if (++endCount === sources.length) {
      destStream.end();
      console.log(`${dest} created`);
    }
  });
  sourceStream
    .pipe(
      split(line => {
        console.log('linke : ', line);
        return line + '\n';
      })
    )
    .pipe(destStream, { end: false });
}
