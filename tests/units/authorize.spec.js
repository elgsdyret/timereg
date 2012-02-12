
var authorize = require('../../source/middleware/authorize');

var expectCallsNextMiddleWareWithoutError = function(nextFunction){
	// if request is valid it will call next with no parameters
	expect(nextFunction).toHaveBeenCalledWith();						
};

describe('/timereg/source/middleware/authorize.js', function(){
	it('authorizes requests with a valid session', function(){		
		var fakeNext = jasmine.createSpy();
		var req = {
			url: 'abc',
			session : {
				currentUser: 'test user'	
			}
		};

		authorize(req, null, fakeNext);

		expectCallsNextMiddleWareWithoutError(fakeNext);			
	});
	it('authorizes requests with a valid session and url that does not require authentication', function(){		
		var fakeNext = jasmine.createSpy();
		var req = {
			url: '/users/login/',
			session : {
				currentUser: 'test user'	
			}
		};

		authorize(req, null, fakeNext);

		expectCallsNextMiddleWareWithoutError(fakeNext);			
	});
	it('denies requests with no session and request url requires authentication', function(){				
		var res = {
			redirect: jasmine.createSpy()
		};
		var req = {
			url: 'abc'
		};

		authorize(req, res, null);

		// if request is in-valid it will redirect to root with status-code 401
		expect(res.redirect).toHaveBeenCalledWith('/', 401);
	});
	it('denies requests with empty session', function(){				
		var res = {
			redirect: jasmine.createSpy()
		};
		var req = {
			session: {}
		};

		authorize(req, res, null);

		// if request is in-valid it will redirect to root with status-code 401
		expect(res.redirect).toHaveBeenCalledWith('/', 401);
	});
	it('denies requests with empty user in session', function(){				
		var res = {
			redirect: jasmine.createSpy()
		};
		var req = {
			session: {currentUser: ''}
		};

		authorize(req, res, null);

		// if request is in-valid it will redirect to root with status-code 401
		expect(res.redirect).toHaveBeenCalledWith('/', 401);
	});	
	it('allows requests to login url even when no session', function(){
		var fakeNext = jasmine.createSpy();
		var req = {
			url: '/users/login/'	
		};

		authorize(req, null, fakeNext);
		
		expectCallsNextMiddleWareWithoutError(fakeNext);
	});
});