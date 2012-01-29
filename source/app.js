/* Load config file */
var app = {};
app.config = require('./util/configLoader.js').config;

/* Mongo DB */
app.mongo = require('./mongo/init')(app);

/* HTTP Application */
var express = require('express');
app.http = express.createServer();

app.http.configure(function () {
    app.http.use(express.logger());
    app.http.use(app.http.router);
});

app.http.configure('development', function () {
    app.http.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    app.http.use(express.static(__dirname + '/public'));
});

app.http.configure('production', function () {
    app.http.use(express.errorHandler());
});

/* Web-endpoints */
require('./webservices/timereg')(app);

app.http.listen(app.config.http.port);

console.log("Web application (Node.JS) listening on http://localhost:" + app.config.http.port);