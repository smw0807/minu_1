//
let sfs = `engine-es\t1\t1\nengine-pg\t1\t1\nengine-redis\t1\t1\nmod-kren-api\t1\t1\nmod-kren-coll\t1\t1\nmod-kren-mng\t1\t1\nweb-ukd\t1\t1\n`;
  let error = false;
  let pcData = [];
  try {
    let sfs_arr = sfs.split("\n");
    console.log(sfs_arr);
    sfs_arr.forEach((e, i) => {
      if (i > 0) {
        let ep = e.split("\t");
        console.log(ep);
        if (ep[0]) {
          if ("web-ukd" != ep[0]) {
            pcData.push({
              name: ep[0],
              state: ep[1] + "/" + ep[2]
            });
          }
        }
      }
    });
  } catch (err) {
    error = true;
    pcData = err.message;
  }