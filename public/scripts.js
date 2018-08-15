
console.log('scripts still running');
var xhr = new XMLHttpRequest();
xhr.open('GET', '/songs/');
xhr.onload = function(){
  var local = xhr.responseText;
  console.log('in func', local);
};
