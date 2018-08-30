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
  const rootPath = '../songs';
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
  let baseUrl = 'https://' + appID + ':' + secret + '@api.planningcenteronline.com/services/v2/songs/'


  //call to return song id based on title
  let returnSongIdUrl = baseUrl + '?where[title]=' + req.query.title;
    PCGetMethod(returnSongIdUrl)
    .then((result) => {
      if (result.meta.total_count == 0) {
        res.sendStatus(404);
      } else if (result.meta.total_count == 1) {
      console.log('this is the song ID', result.data[0].id);


      //call to return arrangement id based on song id
        let returnArrangementUrl = baseUrl + result.data[0].id+'/arrangements'
        PCGetMethod(returnArrangementUrl).then((arrResult) => {
          if (arrResult.meta.total_count == 0) {
            res.sendStatus(404);
          } else if (arrResult.meta.total_count == 1) {
            console.log('this is the arrangement ID', arrResult.data[0].id);
            
          }
        }).catch(
          (err)=>{
            console.log(err);
          }
        );
        }
      }).catch(
        (err) => {
          console.log(err);
        }
      );;
});

async function PCGetMethod(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        let res = JSON.parse(data);
        resolve(res)
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err)
    })
  })
}









