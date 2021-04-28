const aysncUt = require('./asyncUt');

async function test() {
  // let sfs = await aysncUt.exec(`kubectl get statefulset -o=jsonpath='{range .items[*]}{.metadata.name}{"\\t"}{.status.updatedReplicas}{"\\t"}{.spec.replicas}{"\\n"}{end}'`);
  let sfs = await aysncUt.exec('kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{\"\t\"}{.status.updatedReplicas}{\"\t\"}{.spec.replicas}{\"\n\"}{end}"');  
  console.log(sfs);
  let error = false;
  let pcData = [];
  // let coll_state = false;
  try {
    let sfs_arr = sfs.split("\n");
    // console.log(sfs_arr);
    sfs_arr.forEach((e, i) => {
      if (i > 0) {
        let ep = e.split("\t");

        if (ep[0]) {
          if ("web-ukd" != ep[0]) {
            // if ('mod-kren-coll' == ep[0]) {
            //   coll_state = true;
            //   if (ep[1] == '0') {
            //     coll_state = false;
            //   }
            // }
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
}
test();