
describe('adding a single registration', function(){
	it('should be added to list', function(){
		var http = require('http');

		var options = {  			
  			port: 8080,
  			path: '/timeregs/'  		
		};
		
		var registrationsBefore = null;
		callback = function(response) {			
  			var bodyStr = '';

  			//another chunk of data has been recieved, so append it to `str`
  			response.on('data', function (chunk) {
    			bodyStr += chunk;
  			});

  			//the whole response has been recieved, so we just print it out here
  			response.on('end', function () {  				  				  				
    			registrationsBefore = JSON.parse(bodyStr);    	
    			expect(registrationsBefore.length).toBeGreaterThan(0);		
  			});
		};
		http.request(options, callback).end();				
	});
});
