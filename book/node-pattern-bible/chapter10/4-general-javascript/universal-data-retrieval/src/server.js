import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from 'react';
import reactServer from 'react-dom/server.js';
import htm from 'htm';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { StaticRouter, matchPath } from 'react-router-dom';
import { routes } from './frontend/router.js';
import { App } from './frontend/App.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = htm.bind(react.createElement);

/**
 * 1
 * 웹팩 개발 서버를 사용하지 않을 것이므로 서버에서 페이지의 전체 HTML 코드를 반환해야 한다.
 * 서버에서 렌더링한 리액트 애플리케이션의 결과 content를 이 템플릿에 전달하여 최종 HTML을 클라이언트로 반환한다.
 *
 * serverData 인자값을 window.__STATIC_CONTEXT__ 라는 전역변수에 삽입하는 스크립트 태그를 렌더링한다.
 */
const template = ({ content, serverData }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>My library</title>
  </head>
  <body>
    <div id="root">${content}</div>
    ${
      serverData
        ? `<script type="text/javascript"> window.__STATIC_CONTEXT__=${JSON.stringify(
            serverData
          )}</script>`
        : ''
    }
    <script type="text/javascript" src="/public/main.js"></script>
  </body>
</html>`;

/**
 * 2
 * Fastify 서버 인스턴스를 만들고 로깅을 활성화 한다.
 */
const server = fastify({ logger: true });

/**
 * 3
 * Fastify 서버 인스턴스가 fastify-static 플러그인을 사용하여 public 폴더의 모든 정적 파일들을 서비스하도록 한다.
 */
server.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'public'),
  prefix: '/public',
});

/**
 * 4
 * 서버에 대한 모든 GET 요청을 가로채는 catch-all 라우트를 정의한다.
 * 실제 라우팅 로직이 이미 리액트 애플리케이션에 포함되어 있기 때문에 catch-all 라우트를 정의한다.
 * 리액트 애플리케이션이 렌더링할 때 현재 URL을 기반으로 적절한 페이지 컴포넌트를 표시한다.
 */
server.get('*', async (req, reply) => {
  const location = req.raw.originalUrl;
  const staticContext = {};
  /**
   * 5
   * 서버 측에서 react-router-dom의 StaticRouter 인스턴스를 사용하여 애플리케이션 컴포넌트를 감싸야한다.
   * StaticRouter는 서버 측 렌더링에 사용할 수 있는 React Router 버전이다.
   * 이 라우터는 브라우저 윈도우에서 현재의 URL을 획득하지 않고 location 속성을 통해 서버로부터 직접 현재 URL을 전달할 수 있다.
   */
  const serverApp = html`
    <${StaticRouter} location=${location} context=${staticContext}>
      <${App} />
    </${StaticRouter}>
  `;

  /**
   * 6
   * react의 renderToString() 함수를 사용하여 serverApp 컴포넌트에 대한 HTML 코드를 생성할 수 있다.
   * 생성된 HTML은 주어진 URL에서 클라이어트 측 애플리케이션에 의해 생성한 HTML과 동일하다
   * template() 함수를 사용하여 페이지 템플릿으로 생성된 HTML 코드인 content를 감싸고 그 결과를 클라이언트에 전송한다.
   */
  const content = reactServer.renderToString(serverApp);
  const responseHtml = template({ content });

  let code = 200;
  if (staticContext.statusCode) {
    code = staticContext.statusCode;
  }
  console.log('CODE : ', code);

  reply.code(code).type('text/html').send(responseHtml);
});

/**
 * 7
 * Fastify 서버 인스턴스가 요청을 수신할 수 있는 서버를 구동한다.
 */
const port = Number.parseInt(process.env.PORT) || 3000;
const address = process.env.ADDRESS || '127.0.0.1';

server.listen(port, address, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
