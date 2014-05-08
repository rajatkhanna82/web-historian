var fs  = require('fs');
var readline = require('readline');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "origin, content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.sendResponse = function(response, data, status) {
  status = status || 200;
  response.writeHead(status, headers);
  response.end(data);
};

exports.loadFile = function (fileName,res, status){
  fs.readFile(fileName, function(err, data) {
    if (err) throw err;
    exports.sendResponse(res, data.toString(), status);
  });
};

exports.collectData = function(request, callback) {
    var data = "";
    request.on('data', function(partial) {
      data += partial;
      request.on('end', function() {
        callback(data);
      });
    });
}

exports.send404 = function(response) {
  exports.sendResponse(response, "not found", 404);
};
