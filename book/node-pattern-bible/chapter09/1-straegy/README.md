# 9-1. 전략 패턴

---

전략 패턴을 사용하면 **컨텍스트**라는 객체를 활성화시켜 변수 부분을 **전략(Strategy)**이라는 별도의 상호 교환 가능한 객체로 추출하여 로직의 변경을 지원한다.
컨텍스트는 알고리즘 제품군의 공통적인 로직을 구현하는 반면,
전략은 가변적인 부분을 구현하여 컨텍스트가 입력값, 시스템 설정 또는 사용자 기본 설정과 같은 다양한 요소에 따라 동작을 조정할 수 있도록 한다.
전략은 일반적으로 솔루션 제품군의 일부이며 모두 컨텍스트에서 예상하고 있는 동일한 인터페이스를 구현한다.

![전략 패턴의 일반적인 구조](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e9a17f20-82b2-461d-adc1-9854773f2edb/Untitled.png)

전략 패턴의 일반적인 구조

위 구조를 보면 마치 기계의 교체 가능한 부품처럼 컨텍스트 객체가 자신의 구조에 다른 전략으로 전환하여 연결하는 방식을 보여주고 있다.
이 패턴은 주어진 문제 내에서 우려되는 사항을 분리하는데 도움이 될 뿐만 아니라, 더 나은 유연성을 가진 솔루션으로 동일한 문제의 다양한 변형에 적용할 수 있도록 할 수 있다.

전략 패턴은 컴포넌트 동작이 경우에 따라 달라지는 것을 지원하기 위해 복잡한 조건문을 사용하거나, 동일한 역할의 범위에서 다른 컴포넌트를 혼합해야 하는 상황들에서 특히 유용하다.

## 9-1-1. 여러 형식을 지원하는 환경설정 객체

---

데이터베이스 URL 서버의 수신 포트와 같이 애플리케이션에서 사용하는 일련의 매개 변수들을 가진 Config라는 객체를 생각해보자.
Config 객체는 이러한 매개 변수에 접근하기 위한 간단한 인터페이스를 제공할 수 있어야 하지만, 파일과 같은 영구적인 저장소를 사용하여 구성을 가져오고 내보내는 방법도 제공할 수 있어야 한다.
환경설정을 저장하기 위해 json, ini, yaml과 같은 다양한 영식을 지원할 수 있어야 한다.
전략 패턴에 대한 내용을 적용하면 Config 객체에서 동작이 변경될 부분을 즉시 식별할 수 있는데, 이는 설정정보를 직렬화하거나 역 직렬화할 수 있는 기능이다.

```jsx
//config.js
import { promises as fs } from 'fs';
import objectPath from 'object-path';

export class Config {
  //1
  constructor(formatStrategy) {
    this.data = {};
    this.formatStrategy = formatStrategy;
  }

  //2
  get(configPath) {
    return objectPath.get(this.data, configPath);
  }

  //2
  set(configPath, value) {
    return objectPath.set(this.data, configPath, value);
  }

  //3
  async load(filePath) {
    console.log(`Deserializing from ${filePath}`);
    this.data = this.formatStrategy.deserialize(await fs.readFile(filePath, 'utf-8'));
  }

  //3
  async save(filePath) {
    console.log(`Serializing to ${filePath}`);
    await fs.writeFile(filePath, this.formatStrategy.serialize(this.data));
  }
}
```

1. 생성자에서 환경 설정 데이터를 보관하기 위해 data라는 인스턴스 변수를 만든다.
   그런 다음 데이터 구문을 분석하고 직렬화하는데 사용할 컴포넌트를 나타내는 formatStrategy도 저장한다.
2. object-path라는 라이브러리는 점 경로 표기법(예: property.subProperty)을 사용하여 환경 설정 속성에 접근할 수 있는 set()과 get() 두 가지 함수를 제공한다.
3. load() 및 save() 함수는 각각 데이터의 직렬화 및 역 직렬화를 전략에 위임하는 곳이다.
   즉, 생성자에서 입력으로 전달된 formatStrategy에 따라 Config 클래스의 로직이 변경되는 곳이다.

이 디자인을 통해 Config 객체는 데이터를 적재하고 저장할 때 다양한 파일 형식을 원활하게 지원할 수 있다. (하드코딩이 없음)

```jsx
//strategies.js
import ini from 'ini';

export const iniStrategy = {
  deserialize: data => ini.parse(data),
  serialize: data => ini.stringify(data),
};

export const jsonStrategy = {
  deserialize: data => .JSON.parse(data),
  serialize: data => JSON.stringify(data, null, '  '),
};
```

단순히 합의된 인터페이스를 구현하기만 하면 Config 객체에서 사용할 수 있다.

```jsx
//index.js
import { Config } from './config.js';
import { jsonStrategy, iniStrategy } from './strategies.js';

async function main() {
  const iniConfig = new Config(iniStrategy);
  await iniConfig.load('./samples/conf.ini');
  iniConfig.set('book.nodejs', 'design patterns');
  await iniConfig.save('./samples/conf_mod.ini');

  const jsonConfig = new Config(jsonStrategy);
  await jsonConfig.load('./samples/conf.json');
  jsonConfig.set('book.nodejs', 'design patterns');
  await jsonConfig.save('./samples/conf_mod.json');
}
main();
```

환경 설정 관리자의 공통 부분을 구현하는 하나의 Config 클래스만을 정의하고 데이터 직렬화 및 역 직렬화를 위해 서로 다른 전략을 사용하여 다른 형식의 파일을 지원하는 Config 클래스의 인스턴스를 만들었다.

위 예는 전략을 선택하는데 사용할 수 있는 가능한 대안 중 하나이고, 다른 유효한 접근 방법은 다음과 같을 수 있다.

- 두 가지 다른 전략 제품군 생성 :  
  하나는 역 직렬화를 위한 것이고 다른 하는 직렬화를 위한 것이다.
  이렇게 하면 한 형식으로 읽고 다른 형식으로 저장할 수 있다.
- 전략을 동적으로 선택 :  
  제공된 파일의 확장자에 따라 Config 객체는 확장자 맵을 가지고 주어진 확장자에 따라 알맞은 알고리즘을 선택할 수 있다.

패턴 자체의 구현도 많이 다를 수 있는 데, 예를 들어, 가장 간단한 형식으로 컨텍스트와 전략은 모두 간단한 함수일 수도 있다.

`function context(strategy) { ... }`

<aside>
💡 전략 패턴의 구조는 어댑터 패턴의 구조와 유사할 수 있다.
그러나 둘 사이에는 상당한 차이가 있다.
어댑터 객체는 어댑터에 동작을 추가하지 않는다. 단지 다른 인터페이스에서도 사용할 수 있는 호환성을 위한 인터페이스를 가지고 있기 때문에 다른 인터페이스에서도 사용할 수 있다. 물론 하나의 인터페이스를 다른 인터페이스로 변환하기 위한 추가적인 로직을 구현해야 할 수도 있으나 이 로직은 인터페이스로만으로 제한한다.
전략 패턴에서는 컨텍스트와 전략(Strategy) 알고리즘 이렇게 두 가지 다른 부분을 구현하므로 둘 다 어떤 종류의 로직을 구현하고 있으면, 둘 다 최종적인 문제 해결을 위한 알고리즘을 구축하는데 필수적이게 된다.(함께 결합해야 한다)

</aside>

## 9-1-2. 실전에서

Passort는 Node.js용 인증 프레임워크로, 웹 서버가 다양한 인증 체계를 지원할 수 있도록 한다.
최소한의 노력으로 페이스북에 로그인하거나 트위터의 기능을 사용하용 웹 애플리케이션에 로그인할 수 있다.
전략 패턴을 사용하여 인증 프로세스 중에 사용되는 공통된 로직을 실제 인증단계와 같이 변경할 수 있는 부분과 분리 한다.
예를 들어, 페이스북 또는 트위터 프로필에 접근하기 위한 액세스 토큰을 얻기 위해 OAuth를 사용하거나 단순히 사용자 아이디/비밀번호 쌍을 확인하기 위해 로컬 데이터베이스를 사용할 수도 있다.
모두 인증 프로세스를 처리하기 위한 서로 다른 전략이며, 라이브러리가 사실상 제한 없이 인증 서비스를 지원할 수 있도록 한다.
