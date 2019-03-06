var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require ('fs');

router.post('/upload', function (req, res) {

  console.log("req body:" + req.body)


  // create an incoming form object and set some attributes
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../uploaded-files');

  // every time a file has been uploaded successfully, rename it to it's orignal name
  form.on('file', function (field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    res.status(200).send({"success":"true"});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

module.exports = router;
