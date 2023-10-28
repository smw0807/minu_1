import react from 'react';

export class AsyncPage extends react.Component {
  /** 1
   * 이 컴포넌트 클래스는 직접 인스턴스화 되지 않아야 하며 실제 사용할 비동기 페이지를 구현할 때 학장 되어야 한다.
   * 이 클래스를 확장한 비동기 페이지 컴포넌트는 static async preloadAsyncData(props) 및 render() 함수를 구현해야 한다.
   */
  static async preloadAsyncData(props) {
    throw new Error('Must be implemented by sub class');
  }

  render() {
    throw new Error('Must be implemented by sub class');
  }

  /** 2
   * 생성자에서 컴포넌트 상태를 초기화해야 한다.
   * 두 개의 상태가 가능한데,
   * 하나는 데이터가 이미 사용 가능하거나(state에서 설정할 수 있음)
   * 하나는 데이터를 사용할 수 없는 것(state를 loading으로 설정하고 컴포넌트가 페이지에 마운트된 후 데이터를 로드하도록 해야함)
   * 브라우저에서 static context에 데이터를 로드할 수 있따면 이 데이터를 삭제할 수도 있어야 한다.
   * 이렇게하면 사용자가 다른 페이지에서 이 페이지로 되돌아 올 경우 새로운 데이터를 볼 수 있다.
   */
  constructor(props) {
    super(props);
    const location = props.match.url;
    this.hasData = false;

    let staticData;
    let staticError;

    const staticContext =
      typeof window !== 'undefined'
        ? window.__STATIC_CONTEXT__ // 클라이언트 측
        : this.props.staticContext; // 서버측

    if (staticContext && staticContext[location]) {
      const { data, err } = staticContext[location];
      staticData = data;
      staticError = err;
      this.hasStaticData = true;

      typeof window !== 'undefined' && delete staticContext[location];
    }

    this.stat = {
      ...staticData,
      staticError,
      loading: !this.hasStaticData,
    };
  }

  /** 3
   * 브라우저에 의해서만 React에 의해 실행된다.
   * 여기서 데이터가 미리 로드되지 않은 경우를 처리하고 런타임에 데이터를 동적으로 로드해야 한다.
   */
  async componentDidMount() {
    if (!this.hasStaticData) {
      let staticData;
      let staticError;
      try {
        const data = await this.constructor.preloadAsyncData(this.props);
        staticData = data;
      } catch (err) {
        staticError = err;
      }

      this.setState({
        ...staticData,
        loading: false,
        staticError,
      });
    }
  }
}
