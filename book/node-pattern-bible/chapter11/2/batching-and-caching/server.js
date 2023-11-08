import { createServer } from 'http';
import { totalSales } from './totalSales.js';

createServer(async (req, res) => {
  console.group('Server');
  const url = new URL(req.url, 'http://localhost');
  console.log('url : ', url);
  const product = url.searchParams.get('product');
  console.log('product : ', product);
  console.log(`Processing query: ${url.search}`);

  const sum = await totalSales(product);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(
    JSON.stringify({
      product,
      sum,
    })
  );
  console.groupEnd();
}).listen(8000, () => console.log('Server started'));
