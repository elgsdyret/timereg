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

    function getCollection(collectionName, callback) {
        db.collection(collectionName, function (err, collection) {
            if (err) {
                throw err;
            }
            callback(collection);
        });
    }

    var mongo = {
        db:db,
        server:server
    };

    var mongoCollectionsArray = require("./collections.config");

    /** Set up mongo collections **/
    mongoCollectionsArray.forEach(function (collectionName) {
        if (collectionName === "db") {
            throw "Error mongo collection can't be named db, that named is reserved."
        }
        if (collectionName === "server") {
            throw "Error mongo collection can't be named server, that named is reserved."
        }

        getCollection(collectionName, function (collection) {
            mongo[collectionName] = collection;
        });
    });
    return mongo;
};