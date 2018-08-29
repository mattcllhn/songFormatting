const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

app.use(express.static('../public'))

app.listen(3000, () => {
  console.log('listening on 3000')
});

app.get('/', (req, res) => {
  console.log('holy balls its a server');
  res.sendFile(path.resolve('index.html'))
});

app.get('/songs', function (req, res) {
  console.log('get called in /songs');
  const rootPath = '../../Downloads/songs';
  const folders = getDirectories(rootPath);
  let songArr = [];
  for (let i = 0; i < folders.length; i++) {
    const loopPath = rootPath + '/' + folders[i] + '/data.xml';
    let song = fs.readFileAsync(loopPath).then((song) => {
      return parser.parseStringAsync(song);
    });
    songArr.push(song);
  }
  Promise.all(songArr).then(function (values) {
    res.send(JSON.stringify(values));
  });
});

app.put('/make-update', function (req, res) {
  console.log('ping make update',req.query);
  res.send(true);
});

parser.parseStringAsync = function (song) {
  return new Promise(function (resolve, reject) {
    parser.parseString(song, function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
  });
};

fs.readFileAsync = function (filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};

function getDirectories(path) {
  return fs.readdirSync(path).filter((file) => {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}
