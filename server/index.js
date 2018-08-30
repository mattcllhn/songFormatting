const express = require('express');
const path = require('path');
const app = express();
const fs = require('./fileSystem');
const parser = require('./parseString');
const secretStuff = require('./environment.json');
const port = secretStuff.PORT;
const appID = secretStuff.APP_ID;
const secret = secretStuff.APP_SECRET;
const https = require('https');


app.use(express.static('../public'))

app.listen(port, () => {
  console.log('listening on', port)
});

app.get('/', (req, res) => {
  console.log('holy balls its a server');
  res.sendFile(path.resolve('index.html'))
});

app.get('/songs', function (req, res) {
  console.log('get called in /songs');
  const rootPath = '../../Downloads/songs';
  const folders = fs.getDirectories(rootPath);
  let songArr = [];
  for (let i = 0; i < folders.length; i++) {
    const loopPath = rootPath + '/' + folders[i] + '/data.xml';
    let song = fs.readFileAsync(loopPath).then((song) => {
      return parser(song);
    });
    songArr.push(song);
  }
  Promise.all(songArr).then(function (values) {
    res.send(JSON.stringify(values));
  });
});

app.put('/make-update', function (req, res) {
  returnID(req.query.title).then((result) => {
    if (result === false) {
      console.log('no results found for', req.query.title);
      res.sendStatus(404);
    } else if (result) {
      console.log('do some other stuff with this friggin data', result)

    }
  });
});

async function returnID(title) {
  return new Promise((resolve, reject) => {
    https.get('https://' + appID + ':' + secret + '@api.planningcenteronline.com/services/v2/songs/?where[title]=' + title, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        let res = JSON.parse(data);
        if (res.meta.total_count == 0) {
          resolve(false)
        } else if (res.meta.total_count == 1) {
          resolve(res.data[0].id)
        }
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err)
    })
  })
}









