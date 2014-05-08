var fs  = require('fs');

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

exports.loadFile = function (fileName,res){
  console.log(fileName);
  fs.exists(fileName, function(exists) {
    if (exists) {
      fs.stat(fileName, function(error, stats) {
        fs.open(fileName, "r", function(error, fd) {
          var buffer = new Buffer(stats.size);
          fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
            var data = buffer.toString("utf8", 0, buffer.length);
            exports.sendResponse(res,data);
            fs.close(fd);
          });
        });
      });
    }
  });
};
exports.send404 = function(response) {
  exports.sendResponse(response, "not found", 404);
};
