var _ = require('underscore');

module.exports = function (app) {    
    var registrationFactory = require('../models/registrationFactory')();

    app.http.get("/timeregs/", timeregs);
    function timeregs(req, res) {
        app.mongo.timereg.find({}).toArray(function (err, arr) {
            if (err) {
                throw err;
            }
            res.json(arr);
        });
    };

    app.http.post("/timeregs/", createTimeReg);
    function createTimeReg(req, res) {        
        var timeRegToDay = registrationFactory.forToday();                
        var timeReg = _({}).extend(timeRegToDay, req.body);
        app.mongo.timereg.insert(timeReg, function(err, docs) {
            if (err) {
                throw err;
            }

            // TODO: check for more than 1 doc?                
            res.json(docs[0]);            
        });        
    };
};
