/**
 * URL을 입력받아 URL의 내용을 로컬 파일로 다운 받기
 */
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename } from '../utils.mjs';

export function spider(url, cb) {
  const filename = urlToFilename(url);
  /**
   * 1. 파일 존재 여부 확인 후 해당 url에서 이미 다운로드 했는지 검사
   * error 타입이 ENOENT면 파일이 존재하지 않으므로 파일 생성에 문제가 없음
   */
  fs.access(filename, err => {
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`);
      //2. 파일을 찾을 수 없을 경우
      superagent.get(url).end((err, res) => {
        if (err) {
          cb(err);
        } else {
          //3. 파일이 저장도리 디렉터리가 있는지 확인
          mkdirp(path.dirname(filename), err => {
            if (err) {
              cb(err);
            } else {
              //4. HTTP응답의 내용을 파일 시스템에 쓴다.
              fs.writeFile(filename, res.text, err => {
                if (err) {
                  cb(err);
                } else {
                  cb(null, filename, true);
                }
              });
            }
          });
        }
      });
    } else {
      cb(null, filename, false);
    }
  });
}
