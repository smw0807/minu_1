import react from 'react';
import ReactDOM from 'react-dom';
import htm from 'htm';

const html = htm.bind(react.createElement); // 1

class Hello extends react.Component {
  render() {
    // 2
    return html`<h1>Hello ${this.props.name || 'World'}</h1>`;
  }
}

ReactDOM.render(
  html`<${Hello} name="React" />`, // 3
  document.getElementsByTagName('body')[0]
);
