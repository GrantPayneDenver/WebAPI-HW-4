var express = require('express');
var usergrid = require('usergrid');
var request = require('request');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


var app = express();
app.use(express.bodyParser());


var client = new usergrid.client({
	URI: ' https://apibaas-trial.apigee.net/granters/sandbox',
	orgName: 'granters',
	appName: 'Sandbox',
	logging : true
});


// grabbing all movies
app.get('/movies', function(req, res){
  var rtrn = "";
  var rqst = 'https://apibaas-trial.apigee.net/granters/sandbox/movies';
	request({
    url: rqst,
    method: 'GET',
		json: true
		}, function(error, response, body){
    			if(error) {
        		console.log(error);
    		} else {
			if(body.error){
			res.status(400).json(body)
			}else{
        	for (var i = 0 ; i < body.entities.length ; i++){
                delete body.entities[i].uuid;
                delete body.entities[i].type;
                delete body.entities[i].metadata;
                delete body.entities[i].created;
                delete body.entities[i].modified;
    		}
            }
				var responseBody = {};
	    		responseBody.status = "200";
				responseBody.description = "GET for all movies worked";
				responseBody.movies = body.entities;
            res.json(responseBody);
    			}
				});
});

// grabbing particular movie
app.get('/movies/:name', function(req, res){
	var rqst = 'https://apibaas-trial.apigee.net/granters/sandbox/movies/' + req.params.name;
	request({
		url: rqst,
		method: 'GET',
		json: true
		}, function(error, response, body){
					if(error) {
						console.log(error);
					} else {
          if(body.error){
            res.status(400).json({"status" : "400", "description" : "Movie not found :( "});
          }else{
			var responseBody = {};
			responseBody.status = "200";
			responseBody.description = "GET for one movie worked!";
			responseBody.name = body.entities[0].name;
			responseBody.releaseDate = body.entities[0].releaseDate;
			responseBody.actors = body.entities[0].actors;
			res.json(responseBody);
					}
        }
      });
});

app.post('/movies', jsonParser, function(req, res){
		if (req.body.name == undefined || req.body.releaseDate == undefined || req.body.actors == undefined){
        res.status(400).send({"status" : "400", "description" : "Error. Need name, releaseDate, and actors[] in JSON body."});
    } else {
		    request({
	         url: 'https://apibaas-trial.apigee.net/granters/sandbox/movies' ,
	         method: 'POST',
			     json: true,
			     body: {
				         "name" : req.body.name,
				         "releaseDate" : req.body.releaseDate,
				         "actors": req.body.actors
			            }
			     }, function(error, response, body){
	    			     if(error) {
	        		        console.log(error);
	    			     } else {
									 if (body.error){
										 	res.status(400).json({"status" : "400", "description" : "duplicate movie error"});
						 }else{
						 	var responseBody = {};
	    					responseBody.status = "200";
							responseBody.description = "Successfully POSTed a movie";
							responseBody.name = body.entities[0].name;
							responseBody.releaseDate = body.entities[0].releaseDate;
							responseBody.actors = body.entities[0].actors;
							res.json(responseBody);
									 }
	    			     } 
					});
    }
});


app.delete('/movies', function(req, res){
  res.status(400).json({"status" : "400", "description" : "ERROR don't delete all movies"});
});


// Listen for requests until the server is stopped

app.listen(process.env.PORT || 9000);
console.log('The server is running!');
