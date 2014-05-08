var fs = require('fs');
var path = require('path');
var utils = require('../web/utils.js')
var _ = require('underscore');
var http = require('http-request');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.loadFile = function (fileName,res, status){
    console.log("loadFile  :",fileName);
  fs.readFile(fileName, function(err, data) {
    if (err) throw err;
    utils.sendResponse(res, data.toString(), status);
  });
};

exports.readListOfUrls = function(callback){
  callback = callback || _.identity;
  fs.readFile(exports.paths.list, function(err, data) {
      if(err) throw err;
      var sites = [];
      //console.log("readListOfUrls  : "+ data.toString());
      sites = (""+data).split('\n');
      callback(sites);
    });
};

exports.isUrlInList = function(url,res,callback){
  callback = callback || _.identity;

  exports.readListOfUrls(function(sites){
      if(sites.indexOf(url) === -1){
        callback(res);
      }else{
        console.log(url +" is present in the list");
      }
    });
};

exports.addUrlToList = function(url,res, callback){
  callback = callback || _.identity;
  console.log("addUrlToList : URL",url);
  exports.isUrlInList(url,res,function(){
    fs.appendFile(exports.paths.list, "" + url+"\n", function(err) {
      if (err) throw err;
      console.log("added to list :",url);
    });
  });
  callback(res);
};

exports.isURLArchived = function(filename, callback){
  callback = callback || _.identity;
  var filepath = exports.paths.archivedSites + "/"+filename;
  fs.exists(filepath,function(exists){
      callback(exists);
     });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(sitesArr){
     _.each(sitesArr,function(site){
        exports.isURLArchived(site,function(exists){
          if(!exists){
            http.get('http://'+site, function (err, res) {
              if (err) throw err;
              console.log(res.code, res.headers, res.buffer.toString());
              fs.writeFile(exports.paths.archivedSites+ "/"+ site,res.buffer.toString() , function (err) {
                  if (err) throw err;
                  console.log('It\'s saved!');
                });
            });
          }
        });
      });
    });
};

exports.showLoadingPage = function(res){
  var filename = "/loading.html";
  exports.loadAssetFiles(filename,res);
};
exports.loadAssetFiles = function(filename,res){
  var filepath = exports.paths.siteAssets + filename;
  console.log("loading... :",filepath);
   fs.exists(filepath,function(exists){
      if(exists){
        exports.loadFile(filepath,res, 302);
      }else{
        utils.send404(res);
      }
     });

}
exports.showArchivedPage = function(url,res){
  var filename = exports.paths.archivedSites +"/"+ url;
  exports.loadFile(filename,res, 302);
}
