import { createServer } from 'http';
// import { SubsetSum } from './subsetSum.js';
import { SubsetSum } from './subsetSumDefer.js';

createServer(async (req, res) => {
  console.log(req.url);
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/subsetSum') {
    res.writeHead(200);
    return res.end(`I'm alive!\n`);
  }
  const data = JSON.parse(url.searchParams.get('data'));
  const sum = JSON.parse(url.searchParams.get('sum'));
  res.writeHead(200);
  const subsetSum = new SubsetSum(sum, data);
  subsetSum.on('match', match => {
    res.write(`Match: ${JSON.stringify(match)}\n`);
  });
  subsetSum.on('end', () => res.end());
  subsetSum.start();
}).listen(8000, () => console.log('Server Started'));
