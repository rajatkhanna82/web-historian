var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./utils.js');
var urlParser = require("url");


var handleGetRequest = function(req,res){
  var url = urlParser.parse(req.url);
  console.log("GET : ",url.pathname);
  if(url.pathname === '/'){
    archive.loadAssetFiles("/index.html",res);
  }else{
    archive.loadAssetFiles(url.pathname,res);
  }

};

var handlePostRequest = function(req, res) {
  utils.collectData(req,function(data){
    var url = data.toString().slice(4);
    archive.isURLArchived(url, function(exists){
      if(exists){
        archive.showArchivedPage(url,res);
      }else{
        console.log("handlePostRequest -> isURLArchived URL :",url);
        archive.addUrlToList(url,res,archive.showLoadingPage);
      }
    });
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

