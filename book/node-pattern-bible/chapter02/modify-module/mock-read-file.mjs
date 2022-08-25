import fs from 'fs'; // 1

const originalReadFile = fs.readFile; // 2
let mockedResponse = null;

function mockedReadFile(path, cb) {
  // 3
  setImmediate(() => {
    cb(null, mockedResponse);
  });
}

export function mockEnable(respondWith) {
  // 4
  mockedResponse = respondWith;
  fs.readFile = mockedReadFile;
}

export function mockDisable() {
  // 5
  fs.readFile = originalReadFile;
}
