// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var http = require('http-request');

exports.fetcher = function() {
  // iterate on each site
  archive.readListOfUrls(function(sites) {
    // iterate on each url to download
    archive.downloadUrls(urlsToDownload, function(site) {
      // filter out archived websites
      if (archive.isURLArchived(site, function(exists){
        return exists;
      })) {
        return; // skip this site if its already archived
      }
      // download the site
      http.get({
        url: site,
        progress: function(current, total) {
          console.log(site + ' downloaded %d bytes from %d', current, total);
        }
      }, function(err, res){
        // write buffer in the file, check if it was correctly archived in the callback
        fs.writeFile(archive.paths.archivedSites + "/" + site,
          res.buffer.toString(), function(err) {
            if (err) { throw err;} else { console.log(site, " has been archived");}
          });
        // end of writeFile
      });
      // end of get
    });
    // end downloadUrls
  });
  // end readListOfUrls
};
