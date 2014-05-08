var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils.js');
var urlParser = require("url");
var index = 'web/public/index.html';
var loading = 'web/public/loading.html';

var archivesPath = 'archives/sites/';
var rootPath = '/Users/student/Code/Rajat-Romain/2014-04-web-historian/';

var router = {
  '/' : rootPath+index,
  '/styles.css' : rootPath+ 'web/public/',
  'www.google.com' : rootPath +archivesPath,
};

var handleGetRequest = function(req,res){
  var url = urlParser.parse(req.url);
  console.log("GET : ",url.pathname);
  if(router[url.pathname]){
    var filename = router[url.pathname] + url.pathname.slice(1);
    utils.loadFile(filename,res);
    //utils.loadFile(rootPath+index,res);
  }else{
   // utils.send404(res);
  }
};

var handlePostRequest = function(req, res) {
  // console.log(req.method,"RESPONSE :",res );

  utils.collectData(req,function(data){
    var url = data.toString().slice(4);
    if(router[url]){
      var filename = router[url] + url;
      utils.loadFile(filename,res, 302);
    } else {
      archive.addUrlToList(url);
      var filename = rootPath + loading;
      utils.loadFile(filename,res, 302);
    }

  });

  // console.log(query);
};

var actions = {
  'GET' : handleGetRequest,
  'POST' : handlePostRequest,
};

exports.handleRequest = function (req, res) {
    var action = actions[req.method];
    if (action) {
      action(req, res);
    }
};

