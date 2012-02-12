
var errors = require('../util/errors')();

var urlDoesNotRequireAuthentication = function(req){
	// TODO: some better way of comparing this?
	return req.url && req.url.substr(0, '/users/login/'.length) === '/users/login/';
};

var sessionIsValid = function(req){
	return req.session && req.session.currentUser;
};

var isValidForAuthorization = function(req){
	return sessionIsValid(req) || urlDoesNotRequireAuthentication(req);	
};

module.exports = function(){
	return function(req, res, next) {                
        if (!isValidForAuthorization(req)) {
        	return res.redirect('/', errors.notAuthorized().httpCode());        	        
        }
        next();
    }	
}();