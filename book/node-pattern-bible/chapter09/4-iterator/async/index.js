import { CheckUrls } from './checkUrls.js';

async function main() {
  const checkUrls = new CheckUrls([
    'https://www.naver.com',
    'https://nodejsdesignpatterns.com',
    'https://example.com',
    'https://mustbedownforsurehopefully.com',
  ]);

  for await (const status of checkUrls) {
    console.log(status);
  }
}
main();
/*
https://www.naver.com is down, error: (intermediate value).redirect is not a function
https://nodejsdesignpatterns.com is down, error: Moved Permanently
https://example.com is down, error: (intermediate value).redirect is not a function
https://mustbedownforsurehopefully.com is down, error: getaddrinfo ENOTFOUND mustbedownforsurehopefully.com
*/
