import _ from 'lodash';
import './assets/css/common.css'

function component() {
  var element = document.createDocumentFragment('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());