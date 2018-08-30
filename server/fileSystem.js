const fs = require('fs');
module.exports =
    {
        readFileAsync: async function (filename) {
            return new Promise(function (resolve, reject) {
                fs.readFile(filename, function (err, data) {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        },
        getDirectories: function (path) {
            return fs.readdirSync(path).filter((file) => {
                return fs.statSync(path + '/' + file).isDirectory();
            });
        }

    }

