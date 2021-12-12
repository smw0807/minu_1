/**
 * sort
 */
const text = `Node-RED provides a browser-based flow editor that makes it easy to wire together flows using the wide range of nodes in the palette. Flows can be then deployed to the runtime in a single-click.

JavaScript functions can be created within the editor using a rich text editor.

A built-in library allows you to save useful functions, templates or flows for re-use.`;

const arr = text.split(' ');
// console.log(arr);
const sorting = arr.sort(function( a, b) {
  //대소문자 구분 없이 오름차순
  const upperCaseA = a.toUpperCase();
  const upperCaseB = b.toUpperCase();
  
  if(upperCaseA > upperCaseB) return 1;
  if(upperCaseA < upperCaseB) return -1;
  if(upperCaseA === upperCaseB) return 0;

  //대소문자 구분 없이 내림차순
  // const upperCaseA = a.toUpperCase();
  // const upperCaseB = b.toUpperCase();
  
  // if(upperCaseA < upperCaseB) return 1;
  // if(upperCaseA > upperCaseB) return -1;
  // if(upperCaseA === upperCaseB) return 0;
}); 
console.log(sorting);