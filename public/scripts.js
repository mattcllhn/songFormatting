
console.log('scripts still running');
let songList = [];
function getSongs() {
  console.log('hello form getsongs')
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/songs/');
  xhr.send(null);
  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        let res = JSON.parse(xhr.responseText);
        for (let i = 0; i < res.length; i++) {
          songList.push(res[i].data)

        }
        console.log('songList', songList);

      } else {
        console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    }
  }

  // xhr.onload = function () {
  //   var local = xhr.responseText;
  //   console.log('in func', local);
  // };
}

