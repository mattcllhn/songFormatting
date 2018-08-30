const xml2js = require('xml2js');
const parser = new xml2js.Parser();

async function parseStringAsync(song) {
    return new Promise(function (resolve, reject) {
        parser.parseString(song, function (err, result) {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
};
module.exports = parseStringAsync;