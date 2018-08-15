const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
xml2js = require('xml2js');
const parser = new xml2js.Parser();


app.use(express.static('../public'))


app.listen(3000,()=>{
  console.log('listening on 3000')
});

app.get('/',(req, res)=>{
  console.log('holy balls its a server');
  res.sendFile(path.resolve('index.html'))
});

app.get('/songs',function (req, res){
  const rootPath = '../../../../volumes/untitled/songs';
  const folders = getDirectories(rootPath);
  const path = rootPath + '/' + folders[0] + '/data.xml';
  folders.forEach()
  fs.readFile(path, (err, data) => {
    parser.parseString(data, function (err, result) {
      // console.log('data', result);
      console.dir(result.data)
      res.send(JSON.stringify(result.data));
      // oneSong = result;
    })
  });
  // res.send(songArray);
});

async function returnSongs(){
  const rootPath = '../../../../volumes/untitled/songs';
  const folders = getDirectories(rootPath);
  let returnSongs = [];
  for (var i = 0; i < folders.length; i++) {
    const path = rootPath + '/' + folders[i] + '/data.xml';
    const song = await getSong(path);
    returnSongs.push(song);
  }
  return returnSongs;
}
async function getSong(path){
  let oneSong;
    fs.readFile(path, (err, data) => {
      parser.parseString(data, function (err, result) {
        // console.log('data', result);
        oneSong = result;
      })
    });
    console.log(oneSong);
    return oneSong;
}


function getDirectories(path) {
  return fs.readdirSync(path).filter((file) => {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}
