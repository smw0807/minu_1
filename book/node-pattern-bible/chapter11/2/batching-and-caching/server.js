import { createServer } from 'http';
import { totalSales } from './totalSales.js';
// import { totalSales } from './totalSalesBatch.js';

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const product = url.searchParams.get('product');

  const sum = await totalSales(product);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(
    JSON.stringify({
      product,
      sum,
    })
  );
}).listen(8000, () => console.log('Server started'));
