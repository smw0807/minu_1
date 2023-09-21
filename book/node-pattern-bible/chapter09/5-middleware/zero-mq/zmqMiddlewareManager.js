export class ZmqMiddlewareManager {
  // 1
  constructor(socket) {
    this.socket = socket;
    this.inboundMiddleware = [];
    this.outboundMiddleware = [];
    this.handleIncomingMessages().catch(err => console.error(err));
  }

  // 2
  async handleIncomingMessages() {
    for await (const [message] of this.socket) {
      await this.executeMiddleware(this.inboundMiddleware, message).catch(err => {
        console.error(`Error while processing the message`, err);
      });
    }
  }

  //3
  async send(message) {
    const finalMessage = await this.executeMiddleware(this.outboundMiddleware, message);
    return this.socket.send(finalMessage);
  }

  // 4
  use(middleware) {
    if (middleware.inbound) {
      this.inboundMiddleware.push(middleware.inbound);
    }
    if (middleware.outbound) {
      this.outboundMiddleware.unshift(middleware.outbound);
    }
  }

  // 5
  async executeMiddleware(middlewares, initialMessage) {
    let message = initialMessage;
    for await (const middlewareFunc of middlewares) {
      message = await middlewareFunc.call(this, message);
    }
    return message;
  }
}
