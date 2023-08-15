export const consoleTime = new Proxy(console, {
  get(target, props) {
    if (['info', 'log', 'warn', 'error', 'debug'].includes(props)) {
      return function (message) {
        const date = new Date();
        target[props](`[${date.toISOString()}] ${message}`);
      };
    }
    return target[props];
  },
});
