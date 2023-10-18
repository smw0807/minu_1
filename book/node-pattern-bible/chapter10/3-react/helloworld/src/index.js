import react from 'react';
import ReactDOM from 'react-dom';

const h = react.createElement; // 1

// 2
class Hello extends react.Component {
  // 3
  render() {
    // 4
    return h('h1', null, [
      'Hello ',
      this.props.name || 'World', // 5
    ]);
  }
}
//6
ReactDOM.render(h(Hello, { name: 'React' }), document.getElementsByTagName('body')[0]);
