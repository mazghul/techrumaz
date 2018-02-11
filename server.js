var express = require('express');
var app = express();
//var mongojs = require('mongojs'); //When using local MongoDB
//var db = mongojs('mytask',['marklist']);

var mLab = require('mongolab-data-api')('ff6vl0JOX9RkcjG38JqRKx5uIk6WUfWx');

var bodyParser =require('body-parser');
var fs  = require('fs');
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var csvjson = require('csvjson');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/mytask', function (req, res){
	console.log("I receive a GET request")

  //Local DB
	/*db.marklist.find().sort({Percentile : -1}, function (err, docs){
		//console.log(docs);
		res.json(docs);
	
});*/

//MLAB
	var options = {
  database: 'maz',
  collectionName: 'mark'
  //query: '{ "key": "value" }'
};
	  mLab.listDocuments(options,function (err, data) {
    //console.log(data); //=> [ { _id: 1234, ...  } ]
    res.json(data); 
  });
});

//listdb
mLab.listDatabases(function (err, data) {
    if (err) { console.log(err); }
    else {
        console.log("database",data); // => [db1, db2, db3, ...] 
    }
});

//list collections
mLab.listCollections('maz', function (err, collections) {
  console.log("collections",collections); // => [coll1, coll2, ...] 
});

//********************************* INSERT SINGLE RECORD********************************
app.post('/mytask',function(req, res){
  
  //Local DB
  //console.log(req.body);
	/*db.marklist.insert(req.body, function(err, doc){
		res.json(doc);
  });*/
  
  //MLAB
    var options = {
    database: 'maz',
    collectionName: 'mark',
    documents: req.body
  };
	mLab.insertDocuments(options, function(err, doc){
    res.json(doc);
		});
});

//***************************************** DELETION*****************************************
app.delete('/mytask/:id', function (req, res){
	var id = req.params.id;
	//console.log(id);
	/*db.marklist.remove({_id:mongojs.ObjectId(id)}, function (err, doc){
		res.json(doc);
	})*/

	var options = {
  database: 'maz',
  collectionName: 'mark',
  id: id
};
	mLab.deleteDocument(options,  function (err, doc){
    res.json(doc);
    });
});

/* app.get('/fileUpload', function (req, res){
	console.log("I receive a GET request")
	var options = {
  database: 'maz',
  collectionName: 'mark'
};

res.redirect('/mytask');
	
}); */

//*************************************** UPLOAD **********************************************
	app.post('/fileUpload', upload.single('test'), function(req, res,next) {
		console.log("request file",req.file);
		var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/

  var target_path = 'public/uploads/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { 
 var data = fs.readFileSync(target_path, { encoding : 'utf8'});
 
 //var options = { delimiter : ','};
var csvjsonre=csvjson.toObject(data); //Convert CSV to JSON
//console.log(target_path);

//Local DB
 /*db.marklist.insert(csvjsonre, function(err, doc){
		res.json(doc);
		console.log('complete');
	});*/

  //MLAB
  var options = {
  database: 'maz',
  collectionName: 'mark',
  documents: csvjsonre
};
	mLab.insertDocuments(options, function (err, docs) {	
    console.log("complete",docs); 
    res.redirect('/');
    //res.json(docs.n+" documents inserted succesfully");
    
		});
});
  src.on('error', function(err) { console.log('error'); });
});

var server = app.listen((process.env.PORT || 3000) , function(){
	console.log("server running");
})