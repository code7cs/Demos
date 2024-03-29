var http = require('http');
var querystring = require('querystring');

var postHTML =
    '<html><head><meta charset="utf-8"><title>Node.js Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'website: <input name="name"><br>' +
    'URL： <input name="url"><br>' +
    '<input type="submit">' +
    '</form>' +
    '</body></html>';

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        // parse
        body = querystring.parse(body);
        // set head
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf8'
        });

        if (body.name && body.url) { // output data
            res.write("website: " + body.name);
            res.write("<br>");
            res.write("URL：" + body.url);
        } else { // output posthtml
            res.write(postHTML);
        }
        res.end();
    });
}).listen(3000);