
var errors = require('../util/errors')();

var checkUser = function(user) {
	return user && user.name;    	
};

module.exports = function(app){    
    app.http.post('/users/login/', login);
    function login(req, res, next) {                    	
		var user = req.body;		    	

		if (!checkUser(user)) {
			return res.redirect('/', errors.notAuthorized().httpCode());        	        			
		}   		
    	
    	req.session.currentUser = user.name;        
        res.end('logged in');
    }   
};





