import { UrlBuilder } from './urlBuilder.mjs';

const urlA = new UrlBuilder().setProtocol('https').setHostname('www.minwoo.com').build();
console.log(urlA.toString());

const urlB = new UrlBuilder()
  .setProtocol('https')
  .setAuthentication('test', 'test')
  .setHostname('localhost')
  .setPort(9200)
  .build();

console.log(urlB.toString());
