# 9-3 템플릿

템플릿 패턴은 전략 패턴과 공통점이 많다.  
템플릿 패턴은 먼저 컴포넌트의 스켈레톤(공통된부분을 나타냄)을 구현하는 추상 클래스를 정의한다.  
그렇게 되면 일부 단계는 정의되지 않은 상태로 남아 있게 된다.  
그런 다음 하위 클래스는 **템플릿 함수**라고 하는 누락된 함수 부분을 구현하여 컴포넌트의 빈 부분을 채울 수 있다.  
이 패턴의 목적은 모든 컴포넌트의 모든 변형 집합을 정의할 수 있도록 하는 것이다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ce589b7b-e37d-4fbc-8902-fc5f67728f8b/Untitled.png)

위 그림은 표현된 세가지 구체적인 클래스는 템플릿 클래스를 확장하고, 추상 또는 순수 가상인 templateMethod()에 대한 구현을 제공하게 된다.  
자바스크립트에서는 추상 클래스를 정의하는 공식적인 방법이 없으므로 함수를 정의하지 않은 상태로 두거나 항상 예외를 발생시키는 함수에 할당하여 함수를 구현해야 함을 나타낸다.  
상속이 구현의 핵심적인 부분이기 때문에 템플릿 패턴은 다른 패턴보다 더 전통적인 개체지향 패턴으로 여겨질 수 있다.

템플릿 패턴과 전략 패턴은 목적은 매우 유사하지만 두 가지 중요한 차이점은 구조와 구현에 있다.  
둘 다 공통 부분을 재사용하면서 구성 요소의 가변 부분을 변경할 수 있다.

전략 패턴을 사용하면 실행 시에 동적으로 수행할 수 있다.  
템플릿 패턴을 사용하면 구체적인 클래스가 정의되는 그 순간, 전체 컴포넌트 동작이 결정된다.  
이러한 가정하에 템플릿 패턴은 컴포넌트의 사전에 패키징된 변형을 생성하려는 상황에 더 적합할 수 있다.  
항상 그렇듯이 한 패턴과 다른 패턴 사이의 선택은 개발자가 각각의 사용 사례에 대해 다양한 장단점을 고려해 적용해야 한다.

## 9-3-1 환경 설정 관리 템플릿

전략 패턴에서 작성한 Config 객체를 템플릿 패턴으로 다시 구현을 해보자.  
이전 Config 객체에서와 다른 파일 형식을 사용하여 일련의 환경설정 속성들을 로드하고 저장할 수 있도록 할 것이다.

```jsx
import { promises as fsPromises } from 'fs';
import objectPath from 'object-path';

export class ConfigTemplate {
  async load(file) {
    console.log(`Deserializing from ${file}`);
    this.data = this._deserialize(await fsPromises.readFile(file, 'utf-8'));
  }

  async save(file) {
    console.log(`Serializing to ${file}`);
    await fsPromises.writeFile(file, this._serialize(this.data));
  }

  get(path) {
    return objectPath.get(this.data, path);
  }

  set(path, value) {
    return objectPath.set(this.data, path, value);
  }

  _serialize() {
    throw new Error(`_serialize() must be implemented`);
  }

  _deserialize() {
    throw new Error(`_deserialize() must be implemented`);
  }
}
```

\_serialize(), \_deserialize() 함수의 구현은 열어둔다.  
이는 실제로 특정 환경설정 형식을 지원하는 구체적인 Config 클래스를 생성할 수 있도록 하는 템플릿 함수이다.  
템플릿 함수 이름의 시작 부분에 있는 밑줄은 보호된 함수에 플래그를 지정하는 간편한 방법으로 내부 전용임을 나타낸다.  
JavaScript에서는 함수를 추상으로 선언할 수 없기 때문에 **단순한 모형(stubs)**으로 정의하여 호출되면(즉, 구체적인 하위 클래스에 의해 재정의되지 않은 경우) 오류를 발생시킨다.

이제 템플릿을 이용해 구체적인 클래스를 생성해보자.  
예를 들어, JSON 형식으로 사용하여 구성을 로드하고 저장할 수 있다.

```jsx
//jsonConfig.js
import { ConfigTemplate } from './ConfigTemplate.js';

export class JsonConfig extends ConfigTemplate {
  _deserialize(data) {
    return JSON.parse(data);
  }

  _serialize(data) {
    return JSON.stringify(data, null, ' ');
  }
}
```

JsonConfig 클래스는 템플릿 클래스인 ConfigTemplate를 확장하고 \_deserialize(), \_serialize() 함수에 대한 구체적인 구현을 제공한다.

마찬가지로 .ini 파일 형식을 지원하는 IniConfig 클래스도 구현해보자.

```jsx
import { ConfigTemplate } from './ConfigTemplate.js';
import ini from 'ini';

export class IniConfig extends ConfigTemplate {
  _deserialize(data) {
    return ini.parse(data);
  }

  _serialize(data) {
    return ini.stringify(data);
  }
}
```

이제 구체적은 환경설정 관리자 클래스를 사용하여 일부 환경설정 데이터를 로드하고 저장할 수 있다.

```jsx
import { JsonConfig } from './jsonConfig.js';
import { IniConfig } from './iniConfig.js';

async function main() {
  const jsonConfig = new JsonConfig();
  await jsonConfig.load('samples/conf.json');
  jsonConfig.set('nodejs', 'design patterns');
  await jsonConfig.save('samples/conf_mod.json');

  const iniConfig = new IniConfig();
  await iniConfig.load('samples/conf.ini');
  iniConfig.set('nodejs', 'design pattern');
  await iniConfig.save('samples/conf_mod.ini');
}

main();
```

전략 패턴과의 차이점에 유의해야 한다.  
환경설정 데이터를 형식화하고 구문을 분석하는 로직은 런타임에 결정되지 않고 클래스 자체에 포함되어 있다.

템플릿 패턴을 사용하여 부모 템플릿 클래스에 상속된 로직과 인터페이스들을 재사용하고 몇 가지 추상 함수의 구현만을 제공함으로써 최소한의 작업만으로도 새로운 환경설정 관리자를 만들 수 있다.

## 9-3-2 실전에서

6장에서 사용자 정의 스트림을 구현하기 위해 다른 스트림 클래스를 확장할 때 사용했었다.  
거기서 템플릿 함수는 구현하려는 스트림 클래스에 따라 \_write(), \_read(), \_transform(), \_flash() 함수가 템플릿 함수였다.  
새로운 사용자 정의 스트림을 생성하려면 특정 추상 스트림 클래스에서 상속을 받아 템플릿 함수들에 대한 구현을 제공해야 했다.
