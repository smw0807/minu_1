
let hex_str = "jjVAsVNCdyBR6ipJgP3fKS03Kcp1dAFuo72YM2yrf347hKpWml80b3adWo54jPKaCTTDkkk7n4marHp1kPXrmbM0nzks4PJRZzSm3oYzxPMEQpDbZvaoYhOa5ITUvJJ52PVAmUiyLUFyMLYn9Mu9IzU04lc7jheVArMivar97GIZ1QiPcvBLYpsrkQWIWpuCWYlyM8uqGvNIe1tzAoddFyDpHqQlkDgvFbPSEqngVAqgmbV793w7VxiTV0M6cpDTf9RbAVRiBmVTzxm0XKJyKSBUNnkk4Ez0XM6i2qWqUVYwd3Ssbjhj1oxI1ZnO8n5pqDlXIk4U0AHhb4eVUvEGcN7nOKhGusgcuL1eTUgmAHgeTx8GSybhGJOFZbqoaNE8n6F6PasDXHhL3RJdCt8mizK97EEgqqRbQn4zogydJmuqdJBaEe3qOdF2gqergGZLM9av4gdexUwix8Aq5f1uJkWlJ8YA5q3FEnILDFSEXxrWSzEp2d1C";
let front = '<span style=\"background-color:rgba(255,0,0,0.3);\">';
let end = '</span>';
let start_num = [];
let end_num =[];

const pos = [
  { POSITION:  [350, 352], TOKEN: "gc" },
  { POSITION:  [498, 500], TOKEN: "1C" },
  { POSITION:  [492, 494], TOKEN: "Sz" },
  { POSITION:  [308, 310], TOKEN: "1o" },
  { POSITION:  [236, 238], TOKEN: "mb" }
];
for (let i in pos) {
  let pos_str = pos[i].POSITION;
  start_num.push(parseInt(pos_str[0]));
  end_num.push(parseInt(pos_str[1] - 1));
}
let str = '';
for (let i = 0; i < hex_str.length; i++) {
  let hex_data = hex_str[i];
  for (let j = 0; j < start_num.length; j++) {
    let s = start_num[j];
    if (i == s) {
      str += front;
    }
  }
  str += hex_data;
  for (let j = 0; j < end_num.length; j++) {
    let s = end_num[j];
    if (i == s) {
      str += end;
    }
  }
}
console.log(str);
/*
jjVAsVNCdyBR6ipJgP3fKS03Kcp1dAFuo72YM2yrf347hKpWml80b3adWo54jPKaCTTDkkk7n4marHp1kPXrmbM0nzks4PJRZzSm3oYzxPMEQpDbZvaoYhOa5ITUvJJ52PVAmUiyLUFyMLYn9Mu9IzU04lc7jheVArMivar97GIZ1QiPcvBLYpsrkQWIWpuCWYlyM8uqGvNIe1tzAoddFyDpHqQlkDgvFbPSEqngVAqg
<span style="background-color:rgba(255,0,0,0.3);">mb</span>
V793w7VxiTV0M6cpDTf9RbAVRiBmVTzxm0XKJyKSBUNnkk4Ez0XM6i2qWqUVYwd3Ssbjhj
<span style="background-color:rgba(255,0,0,0.3);">1o</span>
xI1ZnO8n5pqDlXIk4U0AHhb4eVUvEGcN7nOKhGus
<span style="background-color:rgba(255,0,0,0.3);">gc</span>
uL1eTUgmAHgeTx8GSybhGJOFZbqoaNE8n6F6PasDXHhL3RJdCt8mizK97EEgqqRbQn4zogydJmuqdJBaEe3qOdF2gqergGZLM9av4gdexUwix8Aq5f1uJkWlJ8YA5q3FEnILDFSEXxrW
<span style="background-color:rgba(255,0,0,0.3);">Sz</span>
Ep2d
<span style="background-color:rgba(255,0,0,0.3);">1C</span>
*/