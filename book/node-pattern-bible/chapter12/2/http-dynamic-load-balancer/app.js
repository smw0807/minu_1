import { createServer } from 'http';
import consul from 'consul';
import portfinder from 'portfinder';
import { nanoid } from 'nanoid';

const serviceType = process.argv[2];
const { pid } = process;

async function main() {
  const consulClient = consul();

  const port = await portfinder.getPortPromise(); // 1
  const address = process.env.ADDRESS || 'localhost';
  const serviceId = nanoid();

  // 2
  function registerService() {
    consulClient.agent.service.register(
      {
        id: serviceId,
        name: serviceType,
        address,
        port,
        tags: [serviceType],
      },
      () => {
        console.log(`${serviceType} [${serviceId}]  registered successfully.`);
      }
    );
  }

  // 3
  function unregisterService(err) {
    err && console.error(err);
    console.log(`deregistering ${serviceType} [${serviceId}]`);
    consulClient.agent.service.deregister(serviceId, () => {
      process.exit(err ? 1 : 0);
    });
  }

  process.on('exit', unregisterService); // 4
  process.on('uncaughtException', unregisterService);
  process.on('SIGINT', unregisterService);

  // 5
  const server = createServer((req, res) => {
    let i = 1e7;
    while (i > 0) {
      i--;
    }
    console.log(`Handling request from ${pid}`);
    res.end(`${serviceType} [${serviceId}] response from ${pid}\n`);
  });

  server.listen(port, address, () => {
    registerService();
    console.log(`Started ${serviceType} [${serviceId}] at ${pid} on port ${port}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
