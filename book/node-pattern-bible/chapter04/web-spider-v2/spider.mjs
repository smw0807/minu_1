import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename, getPageLinks } from '../utils.mjs';
import { spider } from '../web-spider/spider.mjs';

function saveFile(filename, contents, db) {
  mkdirp(path.dirname(filename), err => {
    if (err) return cb(err);
    fs.writeFile(filename, contents, cb);
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url}`);
  superagent.get(url).end((err, res) => {
    if (err) return cb(err);
    saveFile(filename, res.text, err => {
      if (err) return cb(err);
    });
    console.log(`Download and saved: ${url}`);
    cb(null, res.text);
  });
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) return process.nextTick(cb);
  //1
  //페이지에 포함된 모든 링크들을 획득한다.
  //내부적 목적지(동일 호스트 네임)를 가리키는 링크들만 반환한다.
  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) return process.nextTick(cb);

  //2
  //인덱스가 링크 배열의 길이와 같은지 확인한다.
  function iterate(index) {
    if (index === links.length) return cb();

    spider(links[index], nesting - 1, function (err) {
      if (err) return cb(err);
      iterate(index + 1);
    });
  }
  iterate(0); //4 함수를 다시 호출해서 반복 시작
}

export function spider(rul, nesting, db) {
  const filename = urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err);
      }

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    spiderLinks(url, fileContent, nesting, cb);
  });
}
