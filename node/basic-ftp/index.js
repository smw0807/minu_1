const fs = require('fs');
const ftp = require('basic-ftp');
require('dotenv').config();
const { host, user, pass } = process.env;


let client = new ftp.Client();
const upload = async() => {
  client.ftp.verbose = true;
  try {
    await client.access({
      host: host,
      user: user,
      password: pass,
      port: 22
    })
    const cd = await client.cd('/root/smw_test/test/');
    console.log('cd : ', cd);
    const upload = await client.upload(fs.createReadStream('./netbeans-8.2-linux.sh'), 'netbeans-8.2-linux.sh');
    console.log('upload : ', upload);
  } catch (err) {
    console.error('setupFtpClient Error : ', err.message);
    console.error(err);
    client.close();
  }
  client.close();
}

async function run() {
  await upload();
}
run();
