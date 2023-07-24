//server creation

// http method/module
const http = require('http')
const fs = require('fs');
const _ = require('lodash');
const server = http.createServer((req, res) => {
    console.log('request have been made from browser to server');
    // console.log(req.method)
    // console.log(req.url)
    let num = _.random(0, 20);
    console.log(num);

    res.setHeader('Content-Type', 'text/html');
    fs.readFile('/backend/backedn1/index.html', (err, filedata) => {
        if (err) {
            console.log(err);
        }
        else {
            res.write(filedata);
            res.end();
        }
    });
});
// port number ,host ,callback
server.listen(3000, 'localhost', () => {
    console.log("server is listening on port 3000")
})