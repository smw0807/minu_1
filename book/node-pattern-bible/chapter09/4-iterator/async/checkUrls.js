import superagent from 'superagent';

export class CheckUrls {
  //1
  constructor(urls) {
    this.urls = urls;
  }

  [Symbol.asyncIterator]() {
    const urlsIterator = this.urls[Symbol.iterator](); //2

    return {
      //3
      async next() {
        const iteratorResult = urlsIterator.next(); //4
        if (iteratorResult.done) {
          return { done: true };
        }

        const url = iteratorResult.value;
        try {
          const checkResult = (await superagent.head(url)).redirect(2); //5
          return {
            done: false,
            value: `${url} is up, status: ${checkResult.status}`,
          };
        } catch (err) {
          return {
            done: false,
            value: `${url} is down, error: ${err.message}`,
          };
        }
      },
    };
  }
}
