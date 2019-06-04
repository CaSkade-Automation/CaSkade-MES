var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require ('fs');

router.post('/upload', function (req, res) {

  console.log("new file submitted:" + req.body)


  // create an incoming form object and set some attributes
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../uploaded-files');

  // every time a file has been uploaded successfully, rename it to it's orignal name
  form.on('file', function (name, file) {
    console.log('file coming');
    
    fs.rename(file.path, path.join(form.uploadDir, file.name), function(err) {
     if (err) {
       console.log("error while renaming" + err);
     }
    });
  });

  // log any errors that occur
  form.on('error', function (err) {
    console.log('An error has occured: \n' + err);
    res.status(500).send(
      {"success":"false",
        "error":"Error while processing the file"
    });
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    res.status(201).send({"success":"true"});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});


router.get('', function(req, res) {
  console.log('getting order')
  res.status(200).json('Sadly, nobody had the time to code this...')
})

module.exports = router;
