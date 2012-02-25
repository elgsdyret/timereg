

var _ = require('underscore');

/// Generates a safeCollection
module.exports = function(userId, collection) {	
	var extendedCollection = extendMongoCollection(collection);	
	return {
		find: function() {				
			return extendedCollection.createFunction('find', _ensureSafeSelector).apply(extendedCollection, arguments);
		},
		findOne: function() {
			return extendedCollection.createFunction('findOne', _ensureSafeSelector).apply(extendedCollection, arguments);
		},
		insert: function(docs, options, callback) {											
			// If it is not an array we make it into one			
			if (!_(docs).isArray()) {
				docs = [docs];	
			}
														
			// ensure all documents are safe																		
			var safeDocs = _(docs).map(_safe);			

			return collection.insert(safeDocs, options, callback);
		},
		update: function() {			
			return extendedCollection.createFunction('update', 
				_ensureSafeSelector, function(args) { 	args[1] = _safe(args[1]); }).apply(extendedCollection, arguments);
		},
		findAndModify: function() {
			return extendedCollection.createFunction('findAndModify', 
				_ensureSafeSelector, function(args) { args[2] = _safe(args[2]); }).apply(extendedCollection, arguments);		
		}
	};

	function _safe(mongoObj) {
		return _({}).extend(mongoObj, {_userId: userId});
	} 
	
	function _ensureSafeSelector(args) {			
		// Ensure the query always has a selector function												
		if (typeof args[0] === 'function') {
			args.unshift({});						
		}		
		args[0] = _safe(args[0]);				
	}	

	function _modifyArguments(args, modifiers) {				
		_(modifiers).forEach(function(modifier){
			modifier(args);					
		});
	} 

	function extendMongoCollection(collection) {	
		return {
			createFunction: function() {			
				var args = Array.prototype.slice.call(arguments);										
				var functionToWrapName = args[0];
				var modifiers = _(args).tail();

				return function() {									
					var args = Array.prototype.slice.call(arguments);										
					_modifyArguments(args, modifiers);															
					return collection[functionToWrapName].apply(collection, args);																													
				}														
			}			
		}
	}
};


