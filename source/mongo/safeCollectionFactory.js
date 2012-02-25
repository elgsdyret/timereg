
var errors = require('../util/errors')();
module.exports = function(mongo) {			

	var safeCollection = require("./safeCollection");

	// Retrieve colleciton array once
	var mongoCollectionsArray = require("./collections.config");

    // helper function
    function getCollection(collectionName, callback) {
        mongo.db.collection(collectionName, function (err, collection) {
            if (err) {            	
                throw err;
            }
            callback(collection);
        });
    }

    var exposedMongo = function(userId){
    	if (!userId){    		    		
    		return null;
    	}

        var exposedSafeCollections = {};

        /** Set up mongo collections **/
	    mongoCollectionsArray.forEach(function (collectionName) {
	        if (collectionName === "db") {
	            throw "Error mongo collection can't be named db, that named is reserved."
	        }
	        if (collectionName === "server") {
	            throw "Error mongo collection can't be named server, that named is reserved."
	        }

	        getCollection(collectionName, function (collection) {	        	
	            exposedSafeCollections[collectionName] = safeCollection(userId, collection);
	        });
	    });	    
	    return exposedSafeCollections;
    }
    return exposedMongo;
};
