import { spider } from './spider.mjs';

spider(process.argv[2], (err, filename, download) => {
  if (err) {
    console.error(err);
  } else if (download) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already download`);
  }
});
