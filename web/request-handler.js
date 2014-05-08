var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils.js');
var urlParser = require("url");
var index = 'web/public/index.html';
var archivesPath = 'archives/sites/';
var rootPath = '/Users/student/Code/Rajat-Romain/2014-04-web-historian/';

var router = {
  '/' : rootPath+index,
  '/www.google.com' : rootPath +archivesPath,
};

var getMessages = function(req,res){
  var url = urlParser.parse(req.url);
  console.log(req.url,url.pathname);
  if(router[url.pathname]){
    var filename = router[url.pathname] + url.pathname.slice(1);
    utils.loadFile(filename,res);
    // utils.loadFile(rootPath+index,res);
  }else{
   // utils.send404(res);
  }

};
var actions = {
  'GET' : getMessages,
  // 'POST' : postMessages,
  // OPTIONS : options
};
exports.handleRequest = function (req, res) {
    console.log(req.method);
    var action = actions[req.method];
    if (action) {
      action(req, res);
    } else {
      //    utils.send404(response);
    }
};

