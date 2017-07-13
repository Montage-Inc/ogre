var path = require('path')
var fs = require('fs')
var findit = require('findit')
var DecompressZip = require('decompress-zip')
var archiver = require('archiver')
var util = require('./util')

exports.extract = function(fpath, cb) {
  var zip = new DecompressZip(fpath)
  var zipPath = util.genTmpPath()
  var one = util.oneCallback(cb)

  zip
    .on('extract', function() {
      one(null, zipPath)
    })
    .on('error', one)
    .extract({path: zipPath})
}

var validOgrRe = /^\.(shp|kml|tab|itf|000|rt1|gml|vrt)$/i
exports.findOgrFile = function(dpath, cb) {
  var found

  findEachOgrFile(dpath, file => {
    if(!found) cb(null, file);
    found = true
  }, er => {
    if (er) cb(er);
    else if(!found) cb(new Error('No valid files found'))
  })
}

exports.findEachOgrFile = findEachOgrFile;
function findEachOgrFile(dpath, one, done) {
  var finder = findit(dpath)
  var list = [];
  var block = false;

  finder.on('file', function(file, stat) {
    if (validOgrRe.test(path.extname(file))) {
      list.push(file);
      next();
    }
  })
  finder.on('error', function(er) {
    done(er)
    finder.stop() // prevent multiple callbacks, stop at first error
  })
  finder.on('end', function() {
    next()
  })

  function next() {
    if (block) return;

    block = true;

    if (list.length) one(list.shift(), (er) => {
        if(er) return done(er);

        block = false;

        next();
      });

    else done();
  }
}

exports.createZipStream = function(dpath) {
  var zs = archiver('zip')

  fs.readdir(dpath, function(er, files) {
    if (er) return zs.emit('error', er)

    files.forEach(function(file) {
      var f = fs.createReadStream(path.join(dpath, file))
      zs.append(f, {name: file})
    })
    zs.finalize(function(er) {
      if (er) zs.emit('error', er)
    })
  })

  return zs
}
