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

//grunt.loadNpmTasks('grunt-mongoimport');
/*app.get('/', function (req, res) {
	res.send("Hello World From Server.js")
});*/

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/mytask', function (req, res){
	console.log("I receive a GET request")

	/*db.marklist.find().sort({Percentile : -1}, function (err, docs){
		//console.log(docs);
		res.json(docs);
	
});*/
	var options = {
  database: 'maz',
  collectionName: 'mark'
  //query: '{ "key": "value" }'
};
	mLab.listDocuments(options,function (err, data) {
  //console.log(data); //=> [ { _id: 1234, ...  } ]
  res.json(data); 
});


/*person1= {
		name: 'Maz',
		Email:'mazghul@gmail.com',
		Mobileno: '9751009574'
	};

	person2= {
		name: 'ghul',
		Email: 'ghulasan@gmail.com',
		Mobileno: '0562485760'
	};

	person3= {
		name: 'Saff',
		Email: 'saffghul@gmail.com',
		Mobileno: '8681918519'
	};

	var contactlist = [person1, person2, person3];
	res.json(contactlist);*/
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


app.post('/mytask',function(req, res){
	//console.log(req.body);
	/*db.marklist.insert(req.body, function(err, doc){
		res.json(doc);
	});*/

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


//*************************************** upload **********************************************
	app.post('/fileUpload', upload.single('test'), function(req, res,next) {
		//console.log("get req");
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

  	
  	//console.log(data);

 console.log(csvjsonre);
 /*db.marklist.insert(csvjsonre, function(err, doc){
		res.json(doc);
		console.log('complete');
	});*/

  var options = {
  database: 'maz',
  collectionName: 'mark',
  documents: csvjsonre
};
	mLab.insertDocuments(options, function (req, res) {	
  console.log(res); 

		console.log('complete');

		});

 //console.log(typeof(json));
 //console.log(typeof(csvjsonre));
 //console.log(Object.keys(csvjsonre)); 
});
  src.on('error', function(err) { console.log('error'); });

 /// mongoimport --host=127.0.0.1 -d csvdata -c mark --type csv --file csv_location --headerline
 



 /* grunt.initConfig({
  mongoimport: {
    options: {
      db : 'mytask',
      host : 'localhost', //optional 
      port: '27017', //optional 
     // username : 'username', //optional 
     // password : 'password',  //optional 
      stopOnError : false,  //optional 
      collections : [
        {
          name : 'maz',
          type : 'csv',
          file : 'target_path',
          jsonArray : true,  //optional 
          upsert : true,  //optional 
          drop : true  //optional 
        }
      ]
    }
  }
}); */

/*console.log('starting conversion');
  var Converter = require("csvtojson").Converter;
var converter = new Converter({});
 console.log('new conversion');
//end_parsed will be emitted once parsing finished 
converter.fromFile(target_path,function(err,result){
if(err){
	console.log('err');
}
else{
	console.log('result');
	console.log(target_path);
	console.log(result);
}
});
 
//read from file 
fs.createReadStream(target_path).pipe(converter);
        /*upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });*/
	//res.send(req.files);	*/
});
//app.listen(3000);
//console.log("Server Running on port 3000")

var server = app.listen((process.env.PORT || 3000) , function(){
	console.log("server running");
})