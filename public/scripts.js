
console.log('scripts still running');
let songList = [];

function renderSongs(){
  console.log('renderSongs')
for (let i = 0; i < songList.length; i++) {
  let songRow = createDomElement('div','col-xs-12');
  let heading = createDomElement('h4', 'title', songList[i].Song[0].title);
  heading.onclick = function () {
    if (this.parentElement.children[1].classList[1]=='expanded'){
      this.parentElement.children[1].classList.remove('expanded');

    }else{
      this.parentElement.children[1].classList.add('expanded');
    }
  };
  songRow.appendChild(heading);

  let songEc = createDomElement('div', 'expand-collapse');

  let input = createDomElement('textarea', 'text');

  input.setAttribute('rows', '30');
  // input.setAttribute('value', formatSong(songList[i].Arrangement[0].text));
  input.value = formatSong(songList[i].Arrangement[0].text);

  let submitButton = createDomElement('button','text-right', 'Update');

  songEc.appendChild(input);
  songEc.appendChild(submitButton);

  songRow.appendChild(songEc);
  
  document.getElementById('song-target').appendChild(songRow);
}
  // console.log(document.g?etElementById('song-target'));

}

function createDomElement(tag, className, content){
let element = document.createElement(tag);
if(element && className){
  element.classList.add(className)
}
if(element && content){
  element.appendChild(document.createTextNode(content));
}
return element;

}
function formatSong(song){
  let unformattedSong = song[0]
  let formattedSong = unformattedSong
    .replace(/\[ \]/g, "")
    .replace(/\{\,\}/g, '\n');
  console.log(formattedSong);

  return formattedSong;

}
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
        renderSongs();
      } else {
        console.log('Error: ' + xhr.status); // An error occurred during the request.
      }
    }
  }
}

