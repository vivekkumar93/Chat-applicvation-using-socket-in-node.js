// Include http module
var http = require("http")
    , url = require("url");
  
// Making http server.
var server = http.createServer(function (request, response) {
    console.log(" from " + request.url);
    var _get = url.parse(request.url, true).query;
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Here is your data: ' + _get['data']);
});

server.listen(3000, function(){
    console.log('Connected Successfull!');
});