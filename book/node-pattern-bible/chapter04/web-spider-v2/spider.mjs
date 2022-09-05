import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename } from '../utils.mjs';
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

  const links = getPageLinks(currentUrl, body); //1
  if (links.length === 0) return process.nextTick(cb);

  function iterate(index) {
    //2
    if (index === links.length) return cb();

    spider(links[index], nesting - 1, function (err) {
      //3
      if (err) return cb(err);
      iterate(index + 1);
    });
  }
  iterate(0); //4
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
