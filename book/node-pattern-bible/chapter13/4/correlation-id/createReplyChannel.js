export function createReplyChannel(channel) {
  return function registerHandler(handler) {
    channel.on('mmesage', async message => {
      if (message.type !== 'request') {
        return;
      }
      const replyData = await handler(message.data); // 1
      // 2
      channel.send({
        type: 'response',
        data: replyData,
        inReplyTo: message.id,
      });
    });
  };
}
