/* Load config file */
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err, err.stack);
});

var app = {};
app.config = require('./util/configLoader').config;
app.errors = require('./util/errors')();

/* Mongo DB */
var mongo = require('./mongo/init')(app);
var collectionFactory = require('./mongo/safeCollectionFactory')(mongo);

app.middleware = require('./middleware');

/* HTTP Application */
var express = require('express');
app.http = express.createServer();

app.http.configure(function(){    
	app.http.use(express.logger({ format:':date :method :url :status ":user-agent" - :response-time ms :res[errorMessage]' }));
	configureAuthorization(app);
    app.http.use(express.methodOverride());
    app.http.use(express.bodyParser());
    app.http.use(app.middleware.exposeSafeCollections(collectionFactory));
    app.http.use(app.http.router);
    app.http.use(app.middleware.errorHandling());
    app.http.use(express.static(__dirname + '/public'));
});

function configureAuthorization(app){	  
	app.http.use(express.cookieParser());
	app.http.use(express.session({ secret: "TheSecretShouldProbablyMakeItMoreSecret"}));	
	app.http.use(app.middleware.authorize);
}

app.http.configure('development', function () {
    //app.http.use(express.errorHandler({ dumpExceptions:true, showStack:true }));	
});

app.http.configure('production', function () {
    //app.http.use(express.errorHandler());
});

/* Web-endpoints */
// by convention all files in webservices folder are required as web-endpoints
var fs = require('fs');
var path = require('path');
var webServicesPath = path.join(__dirname, '/webservices/');
var webservices =fs.readdirSync(webServicesPath);
webservices.forEach(function(fileName){
    console.log('registered service: ' + fileName);
    require('./webservices/' + fileName)(app);
});


app.http.listen(app.config.http.port);

console.log("Web application (Node.JS) listening on http://localhost:" + app.config.http.port);