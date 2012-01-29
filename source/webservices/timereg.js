module.exports = function (app) {
    
    app.http.get("/timeregs/", timeregs);

    function timeregs(req, res) {
        app.mongo.timereg.find({}).toArray(function (err, arr) {
            if (err) {
                throw err;
            }
            res.send(JSON.stringify(arr));
        });
    };

    app.http.post("/timeregs/", createTimeRegForToday);

    function createTimeRegForToday(req, res) {
      
        var rightNow = new Date();        
        var cloneDate = function(fromDate) {
            var date = new Date();
            date.setFullYear(fromDate.getFullYear());
            date.setMonth(fromDate.getMonth());
            date.setDate(fromDate.getDate());    
            return date;                
        };

        var startTime = cloneDate(rightNow);        
        startTime.setHours(8);
        startTime.setMinutes(30);

        var endTime = cloneDate(rightNow);
        endTime.setHours(16);
        endTime.setMinutes(30);

        var timeRegToDay = {
            start: startTime,
            end: endTime,
            breakTime: '30m',
            description: 'sba backend'            
        }

        // TODO: do we want to close the db connection?
        app.mongo.timereg.insert(timeRegToDay, function(err, docs) {
            if (err) {
                throw err;
            }
            res.send(JSON.stringify(docs));            
        });        


    };

};