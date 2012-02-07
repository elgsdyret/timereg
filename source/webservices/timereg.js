var _ = require('underscore');
var ObjectID = require("mongodb").BSONPure.ObjectID;
var registrationFactory = require('../models/registrationFactory')();

module.exports = function (app) {    
    
    app.http.get("/timeregs/", getTimeregs);
    function getTimeregs(req, res, next) {                        
        app.mongo.timereg.find({}).toArray(function (err, arr) {
            if (err) {
                return next(app.errors.mongoError(err));
            }
            res.json(arr);
        });                    
    };

    app.http.post("/timeregs/", createTimeReg);
    function createTimeReg(req, res, next) {                
        var timeRegToDay = registrationFactory.forToday();                
        var timeReg = _({}).extend(timeRegToDay, req.body);        
        app.mongo.timereg.insert(timeReg, function(err, docs) {
            if (err) {
                return next(app.errors.mongoError(err));
            }            

            res.json(docs[0]);            
        });        
    };

    app.http.post("/timeregs/query/", runQuery);
    function runQuery(req, res, next) {           
        app.mongo.timereg.find(req.body).toArray(function (err, arr) {
            if (err) {
                return next(app.errors.mongoError(err));
            }            
            res.json(arr);
        });                    
    };

    app.http.get("/timeregs/:id", getSpecificTimeReg);
    function getSpecificTimeReg(req, res, next){                    
        app.mongo.timereg.findOne({ _id:new ObjectID(req.params.id)}, function (err, object) {

            if (err) {
                return next(app.errors.mongoError(err));
            }

            if (!object) {
                return next(app.errors.entityNotFound(req.params.id));
            }
                        
            res.json(object);
        });
    };

    app.http.put("/timeregs/:id", updateTimeReg);
    function updateTimeReg(req, res, next){
        var object = req.body;                
        app.mongo.timereg.update({_id: new ObjectID(req.params.id)}, object, {safe: true}, function(err, count) {
            if (err) {                
                return next(err);
            }

            if (count==0) {
                return next(app.errors.entityNotFound(req.params.id));
            }
            
            res.json(object);
        });
    };

    app.http.del("/timeregs/:id", deleteTimeReg);
    function deleteTimeReg(req, res, next){        
        app.mongo.timereg.findAndModify({_id:new ObjectID(req.params.id)}, {}, {}, {remove:true}, function (err, object) {

            if (err) {
                return next(error);
            }

            if (!object) {
                return next(app.errors.entityNotFound(req.params.id));
            }

            res.json({success:true});
        });
    };
};
