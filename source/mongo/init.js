/* Load config file */
module.exports = function (app) {
    /* Mongo DB */
    var mongodb = require('mongodb');
    var mongoConfig = app.config.mongo;

    var server = new mongodb.Server(mongoConfig.host,
        mongoConfig.port,
        mongoConfig.serverOptions
    );

    var db = new mongodb.Db(mongoConfig.database,
        server,
        mongoConfig.dbOptions
    );

    /* always open mongoDB */
    db.open(function (err) {
        if (err) {
            throw err;
        }
    });

    var mongo = {
        db:db,
        server:server
    };
    
    return mongo;
};