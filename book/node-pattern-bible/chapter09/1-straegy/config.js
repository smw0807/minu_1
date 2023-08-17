import { promises as fs } from 'fs';
import objectPath from 'object-path';

export class Config {
  //1
  constructor(formatStrategy) {
    //환경 설정 데이터 보관
    this.data = {};
    //데이터 구문을 분석하고 직렬화하는데 사용할 컴포넌트
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
/*
1. 생성자에서 환경 설정 데이터를 보관하기 위해 data라는 인스턴스 변수를 만든다.
  그런 다음 데이터 구문을 분석하고 직렬화하는데 사용할 컴포넌트를 나타내는 formatStrategy도 저장한다.
2. object-path라는 라이브러리는 점 경로 표기법(예: property.subProperty)을 사용하여 환경 설정 속성에 접근할 수 있는 set()과 get() 두 가지 함수를 제공한다.
3. load() 및 save() 함수는 각각 데이터의 직렬화 및 역 직렬화를 전략에 위임하는 곳이다.
  즉, 생성자에서 입력으로 전달된 formatStrategy에 따라 Config 클래스의 로직이 변경되는 곳이다.
*/
