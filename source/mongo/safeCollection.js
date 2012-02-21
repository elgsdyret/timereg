

var errors = require('../utils/errors')(),
_ = require('underscore');

/// Generates a safeCollection
module.exports = function(userId, collection, errorCallback) {	
	var mongoBuilder = createMongoBuilder(userId);

	return {
		find: function() {	
			return mongoBuilder.ensureSafeSelector(collection.find);
		},
		findOne: function() {
			return mongoBuilder.ensureSafeSelector(collection.findOne);
		},
		insert: function(docs, options, callback) {											
			// If it is not an array we make it into one
			if (!_(docs).isArray()) {
				docs = [docs];	
			}
														
			// ensure all documents are safe															
			_(docs).each(function(doc){
				mongoBuilder.safe(doc);
			});

			return collection.insert(docs, options, callback);
		}
	}
};

function createMongoBuilder(userId) {
	return {
		safe: function(selector) {
			selector = selector || {};
			selector._userid = userId;
			return selector;		
		},						
		ensureSafeSelector: function(collection, functionToWrapName) {			
			return function() {									
				var args = Array.prototype.slice.call(findArgs);
										
				// Ensure the query always has a selector function										
				if (typeof arguments[0] === 'function') {
					args.unshift({});				
				}

				args[0] = this.safe(args[0])				
				return collection[functionToWrapName].apply(args);																													
			}														
		}	
}

