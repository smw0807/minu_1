import _ from 'lodash';

function component() {
  var element = document.createDocumentFragment('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());