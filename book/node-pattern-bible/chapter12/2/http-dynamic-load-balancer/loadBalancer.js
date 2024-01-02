import { createServer } from 'http';
import httpProxy from 'http-proxy';
import consul from 'consul';

// 1
const routing = [
  {
    path: '/api',
    service: 'api-service',
    index: 0,
  },
  {
    path: '/',
    service: 'webapp-service',
    index: 0,
  },
];

const consulClient = consul(); // 2
const proxy = httpProxy.createProxyServer();

const server = createServer((req, res) => {
  // 3
  const route = routing.find(route => req.url.startWith(route.path));
  console.log('route : ', route);
  // 4
  consulClient.agent.service.list((err, services) => {
    const servers =
      !err && Object.values(services).filter(service => service.Tags.includes(route.service));
    console.log('servers : ', servers);

    if (err || !servers.length) {
      res.writeHead(502);
      return res.end('Bad Gateway');
    }

    route.index = (route.index + 1) % servers.length; // 5
    const server = servers[route.index];
    const target = `http://${server.Address}:${server.port}`;
    proxy.web(req, res, { target });
  });
});

server.listen(8080, () => {
  console.log('Load balancer started on port 8080');
});
