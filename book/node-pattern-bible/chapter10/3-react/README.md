# 10-3 React 개요

React는 웹 애플리케이션에서 뷰 레이어를 만들기 위한 포괄적인 기능과 도구를 제공하는 데 중점을 둔다.  
**컴포넌트** 개념에 초점을 맞추어 뷰의 추상화를 제공한다.  
컴포넌트는 버튼, 입력 폼, HTML div와 같은 간단한 컨테이너 혹은 사용자 인터페이스의 다른 요소일 수 있다.  
개념은 특정 책임이 있는 재사용성이 높은 컴포넌트를 정의하고 구성하여 애플리케이션의 사용자 인터페이스를 구성할 수 있어야 한다는 것이다.

React가 웹용 다른 뷰 라이브러리와 다른 점은 설계상 DOM에 바인딩되지 않는다는 것이다.  
**가상 DOM**이라는 높은 수준의 추상화를 제공한다.  
환경 또는 하드웨어 컴포넌트 간의 상호작용을 정의할 수 있다.  
간단히 말해 가상 DOM은 트리와 같은 구조로 구성된 데이터를 다시 렌더링하는 효율적인 방법으로 볼 수 있다.

React의 철학은 모든 플랫폼이 본질적으로 다르므로 개발자가 관련 대상 플랫폼에 최적화된 다양한 애플리케이션을 작성하도록 권장한다.  
React는 라이브러리로서 설계 및 아키텍처 원칙과 한 번 마스터하면 플랫폼별 코드를 작성하는데 쉽게 사용할 수 있는 도구들을 제공하는 것에 초점을 맞춘다.

<aside>
💡 모바일 앱용 React Native   
OpenGL을 사용한 2D 렌더링용 React PIXI   
3D 장면을 만드는 React-Three-Fiber 및 React Hardware   
도 있다.

</aside>

React는 거의 동일한 코드를 사용하여 클라이언트와 서버 모두에서 React 컴포넌트를 렌더링할 수 있다.  
한가지 예로 Node.js에서 페이지를 직접 표시하는데 필요한 HTML 코드를 렌더링할 수 있다.  
페이지가 브라우저에 로드되면 React는 **hydration**이라는 프로세스를 수행하여 클릭 핸들러, 애니메이션, 추가 비동기 데이터 로딩, 동적 라우팅과 같은 모든 프론트엔트 측의 효과를 추가한다.

이 접근 방식은 최초의 렌더링이 대부분 서버에서 일어나는 **싱글 페이지 애플리케이션(SPA: Single Page Application)**을 구축할 수 있게 해준다.  
페이지가 브라우저에 로드되고 사용자와 상호작용을 시작하면, 변경해야 할 페이지의 부분만 동적으로 새로 고치고, 전체 페이지에 대한 재로딩이 필요없게 된다.  
이 디자인은 두가지 주요 장점을 제공한다.

- **향상된 검색 엔진 최적화(SEO: Search Engine Optimization)**  
  페이지 마크업이 서버에 의해 미리 렌더링되기 때문에 다양한 검색 엔진이 서버에서 반환한 HTML만 보고도 페이지의 내용을 이해할 수 있다.  
  브라우저 환경을 시뮬레이션하고 페이지가 완전히 로드될 때까지 기다릴 필요가 없다.
- **성능 향상**  
  마크업을 미리 렌더링하고 있기 때문에, 브라우저가 페이지에 포함된 JavaScript 코드를 다운로드하고 구문 분석 및 실행하는 동안에도 브라우저에 표출될 수 있다.  
  이 접근 방식은 콘텐츠가 더 빨리 로드되는 것처럼 보이고, 렌더링 중에 브라우저가 깜빡거림이 적기 때문에 더 나은 사용자 경험을 제공할 수 있다.

<aside>
💡 React에서는 DOM이 모든 변경에 따라 전체가 렌더링되지 않고, 뷰를 업데이트하기 위해 DOM에 적용할 최소 변경 수를 미리 계산할 수 있는 스마트 인 메모리 비교 알고리즘을 사용한다.   
이는 빠른 브라우저 렌더링을 위한 매우 효율적인 메커니즘을 제공한다.

</aside>

## 10-3-1 Hello React

```bash
npm init -y
npm i -D webpack webpack-cli
node_modules/.bin/webpack init

npm i react react-dom
```

```jsx
import react from 'react';
import ReactDOM from 'react-dom';

const h = react.createElement; // 1

// 2
class Hello extends react.Component {
  // 3
  render() {
    // 4
    return h('h1', null, [
      'Hello',
      this.props.name || 'World', // 5
    ]);
  }
}
//6
ReactDOM.render(h(Hello, { name: 'React' }), document.getElementsByTagName('body')[0]);
```

1. react.createElement 함수에 대한 별칭을 만들기.  
   이 함수를 두 번 사용하여 React 엘리먼트를 만들 것이다.  
   일반 DOM 노드(일반 HTML 태그) 또는 React 엘리먼트의 인스턴스일 수 있다.
2. react.Component 클래스를 확장하는 Hello 컴포넌트를 정의한다.
3. 모든 React 컴포넌트는 render() 함수를 구현해야 한다.  
   이 함수는 컴포넌트가 DOM에서 렌더링되고 React 엘리먼트를 반활할 때 화면에 표시되는 방식을 정의한다.
4. react.createElement 함수를 사용하여 h1 DOM 엘리먼트를 생성한다.  
   이 함수에는 3개의 인자가 필요하다.  
   첫 번째 인자는 태그 이름(문자열) 또는 React 컴포넌트 클래스이다.  
   두 번째 인자는 속성(또는 props)을 컴포넌트에 전달하는데 사용되는 객체이다.(없는 경우 null)  
   세 번째 인자는 자식 엘리먼트의 배열(또는 여러 인자도 전달가능)이다.
5. this.props를 사용하여 실행 시 이 컴포넌트에 전달되는 속성에 접근한다.  
   위 예제에서는 name 속성을 찾고있다. 이것이 전달되면 이를 사용해서 텍스트 노드를 생성한다.  
   그렇지 않으면 “World” 문자열을 기본 값으로 사용한다.
6. ReactDOM.render()를 사용하여 애플리케이션을 초기화한다.  
   이 함수는 React 애플리케이션을 기존 페이지에 연결하는 역할을 한다.  
   애플리케이션은 React 컴포넌트의 인스턴스일 뿐이다.  
   여기서는 Hello 컴포넌트를 인스턴스화하고 name 속성에 “React” 문자열을 전달한다.  
   마지막 인자로 페이지의 어느 DOM 노드가 애플리케이션의 부모 엘리먼트가 될지 지정해야 한다.  
   위 예제의 경우 페이지의 body 엘리먼트를 사용하지만 페이지의 기존의 다른 DOM 엘리먼트를 타깃으로 할 수도 있다.
