// crowi-fileupload-aws

module.exports = function(crowi) {
  'use strict';

  var gcs = require('@google-cloud/storage')({
      projectId: crowi.env.PROJECT_ID, // config.crowi['gcp:prijectId']
      keyFilename: crowi.env.KEY_FILE_NAME // config.crowi['gcp:keyFilename']
    })
    , Config = crowi.model('Config')
    , config = crowi.getConfig()
    , lib = {}
    , bucketName = crowi.env.BUCKET_NAME // config.crowi['gcp:bucket']
    , bucket = gcs.bucket(bucketName)
    ;

  lib.deleteFile = function(filePath) {
    // TODO: validate

    var file = bucket.file(filePath);

    return new Promise(function(resolve, reject) {
      file.delete(function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  lib.uploadFile = function(filePath, contentType, fileStream, options) {
    // TODO: validate

    var file = bucket.file(filePath);

    return new Promise(function(resolve, reject) {
      var options = {public: true, metadata: {contentType: contentType}}
      var stream = file.createWriteStream(options);
      stream.on('error', function(err) {
        reject(err);
      })
      stream.on('finish', function() {
        resolve();
      })
      fileStream.pipe(stream);
    });
  }

  lib.generateUrl = function(filePath) {
    var url = 'https://storage.googleapis.com/' + bucketName + '/' + filePath;

    return url;
  }

  return lib;
}
