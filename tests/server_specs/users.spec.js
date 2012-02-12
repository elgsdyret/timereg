
var restler = require('restler');
var _ = require('underscore');

describe('timereg/source/webservices/users.js', function(){
	
  	
  	// TODO: all these urls - put somewhere? - repeated in multiple tests and in the services
  	var baseUrl = 'http://localhost:8080/';
  	var usersUrl = baseUrl + 'users/';
  	var registrationUrl = baseUrl + 'timeregs/';
  	var loginUrl = usersUrl + 'login/';

	it('can login a user', function() {
		var user = { name: 'test user'};					
		restler.post(loginUrl, {data: user}).on('complete', sessionCookieReturned);

		var session = null;
		function sessionCookieReturned(data, resp){			
			session = resp.headers['set-cookie'];	
			var options = { headers: { 'cookie': session, 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}};

			restler.get(registrationUrl, options).on('complete', retrievedRegistrations);
		}

		var dataRetrieved = null;
		function retrievedRegistrations(data, resp){									
			dataRetrieved = _(data).isArray();				
		}
					
		waitsFor(function() {
	      return dataRetrieved;
	    }, 200);	    
	});
	it('will not log in if no user name', function() {
 		restler.post(loginUrl, {data: {}}).on('4XX', accessDenied);
		
		var isDenied = null;
		function accessDenied(){
			isDenied = true;
		}

		waitsFor(function() {
	      return isDenied;
	    }, 200);

	    runs(function(){      
	      expect(isDenied).toBeTruthy();
	    });																	
	});
	it('will not gain access if not logged in', function() {
 		restler.get(registrationUrl).on('4XX', accessDenied);
		
		var isDenied = null;
		function accessDenied(){
			isDenied = true;
		}

		waitsFor(function() {
	      return isDenied;
	    }, 200);

	    runs(function(){      
	      expect(isDenied).toBeTruthy();
	    });																	
	});
});