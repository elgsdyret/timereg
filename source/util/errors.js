
var _ = require('underscore');
module.exports = function(){	
	
	var error = function(error) {
		return _({}).extend({
			getHttpCode: function(){
				return this.httpCode || this.errorCode || 500;
			}
		}, error);	
	}

	return {
		entityNotFound: function(id) {			
			return error({
				errorCode: 404,
				message: 'entity not found',
				requestedEntityId: id	
			})					
		},
		mongoError: function(err) {
			return error({
				errorCode: 500				
			})
		},
		notAuthorized: function(err) {
			return error({
				message: err,
				errorCode: 401,				
			})
		},
		noUser: function(err) {			
			var message = 'no user: ' + err; 
			return error({
				message: message,
				errorCode: 401				
			})
		}
	};	
};



