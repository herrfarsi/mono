var express = require('express');
var router = express.Router();

var fs = require('fs-extra');
var http = require('http');
var Caman = require('caman').Caman;
var Canvas = require('canvas');
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var formidable = require('formidable');
var util = require('util');

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.post('/', function(req, res, next) {
	var form = new formidable.IncomingForm();
	var color = '#000000';

	form.parse(req, function(err, fields, files) {
		color = fields.color;
		var filename = files.upload.name;

		var temp_path = files.upload.path;
		var file_name = files.upload.name;
		var new_location = 'public/uploads/';
		var newPath = new_location + file_name;
		fs.copy(temp_path, newPath, function(err) {
		  if (err) {
		    console.error(err);
		  } else {
		    console.log("success!")
			var render = Caman(newPath, function () {
				this.newLayer(function () {
				  this.fillColor(color);
				});
				this.newLayer(function () {
				  this.copyParent();
				  this.filter.greyscale();
				  this.filter.brightness(5);
				  this.filter.contrast(10);
				  this.setBlendingMode('multiply');
				});
				this.render(function () {
				  this.save(newPath);
				});
			});
			Caman.Event.listen(render, "processComplete", function (job) {
				res.render('index', { title: 'Express', image: '/uploads/' + filename});
			});
		  }
		});
	});
});

module.exports = router;
