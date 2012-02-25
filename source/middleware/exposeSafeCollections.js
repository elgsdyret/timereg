
var errors = require('../util/errors')();

module.exports = function(collectionFactory) {		
	return function(req, res, next) {                
        var userId = req.session.currentUser;                
     	var factory = collectionFactory(userId);
     	
     	// TODO: the user end-point does need access to factory, so failing automatically does not work
     	// should failed when used, but not a good way to do this without making mongo a function :-(
     	/*if (!factory) {
     		return next(errors.noUser());
     	}*/
     	
		req.mongo = factory;         		

        next();
    }	
};
