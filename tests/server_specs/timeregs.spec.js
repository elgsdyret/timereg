
var _ = require('underscore');
var restler = require('restler');
var timeregService = null, timeregService2 = null;

var createServices = function(){
  createServices = function() {}; //only run once    
  var user = { name: 'test user' };
  var user2 = { name: 'test user2' };  

  restler.post('http://localhost:8080/users/login/', {data: user}).on('complete', saveSession);
  function saveSession(data, resp){
      var session = resp.headers['set-cookie'];
      var options = { baseURL: 'http://localhost:8080/timeregs/', headers: { 'cookie': session, 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}};
      timeregService = new restler.Service(options);
  };          

  restler.post('http://localhost:8080/users/login/', {data: user2}).on('complete', saveSession2);
  function saveSession2(data, resp){
      var session = resp.headers['set-cookie'];
      var options = { baseURL: 'http://localhost:8080/timeregs/', headers: { 'cookie': session, 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}};
      timeregService2 = new restler.Service(options);
  };
};

describe('timereg/source/webservices/timeregs.js', function(){	  
  beforeEach(function(){
    createServices();          
    waitsFor(function() {
      return timeregService;
    }, 200);
  });
  
  it('should be added to list', function(){		
    var regsBefore = null;
    var regsAfter = null;
    timeregService.get('', {}).on('complete', setRegistrationsBefore); 
    function setRegistrationsBefore(data, resp){                              
        regsBefore = data.length;     
        timeregService.post('', {}).on('complete', afterCreation);
    }

    function afterCreation(){     
        timeregService.get('', {}).on('complete', setRegistrationsAfter);  
    }

    function setRegistrationsAfter(data, resp){               
        regsAfter = data.length;
    }
      
    waitsFor(function() {
      return regsAfter;
    }, 200);

    runs(function(){      
      expect(regsAfter).toBe(regsBefore+1);
    });
	});
  it('should be in list after being added', function(){
        
    var createdRegistration = null;
    timeregService.post('', {}).on('complete', afterCreation);
    function afterCreation(data, resp){
      createdRegistration = data;              
      timeregService.get('', {}).on('complete', checkItIsCreated);
    }

    var matchingRegistrations = null;
    function checkItIsCreated(data, resp){      
      matchingRegistrations = _(data).filter(function(registration) { return registration._id == createdRegistration._id; });     
    }

    waitsFor(function() {
      return matchingRegistrations;
    }, 200);

    runs(function(){      
      expect(matchingRegistrations.length).toBe(1);
    });
  });
  it('should default to the current date', function(){
    var today = new Date();          
    var registration = {              
        start: '04:22',
        end: '17:32',
        breakTime: '45m',
        description: 'test values'            
    };        

    var createdRegistration = null;
    timeregService.post('', {}).on('complete', afterCreation);
    function afterCreation(data, resp){
      createdRegistration = data;                    
    }
    
    waitsFor(function() {
      return createdRegistration;
    }, 200);

    runs(function(){      
      expect(createdRegistration.day).toEqual(today.getDate());
      expect(createdRegistration.month).toEqual(today.getMonth());
      expect(createdRegistration.year).toEqual(today.getFullYear());
    });
  });
  it('should contain the data put in', function(){
        
    var registration = {      
        day: '7',
        month: '6',
        year: '2020',
        start: '04:22',
        end: '17:32',
        breakTime: '45m',
        description: 'test values'            
    };        

    var createdRegistration = null;
    timeregService.post('', {data: registration}).on('complete', afterCreation);
    function afterCreation(data, resp){
      createdRegistration = data;                    
    }
    
    waitsFor(function() {
      return createdRegistration;
    }, 200);

    runs(function(){      
      expect(createdRegistration.day).toEqual(registration.day);
      expect(createdRegistration.month).toEqual(registration.month);
      expect(createdRegistration.year).toEqual(registration.year);
      expect(createdRegistration.start).toEqual(registration.start);
      expect(createdRegistration.end).toEqual(registration.end);
      expect(createdRegistration.breakTime).toEqual(registration.breakTime);
      expect(createdRegistration.description).toEqual(registration.description);
    });
  });
  it('should update data', function(){        
    var updatedRegistration = null;
    
    timeregService.post('', {}).on('complete', afterCreation);
    
    function afterCreation(data, resp){    
      var updateUrl = data._id;
      timeregService.put(updateUrl, {data: {'description': 'new description'}}).on('complete', afterUpdate);      
    }

    function afterUpdate(data, resp){            
      updatedRegistration = data;
    }
  
    waitsFor(function() {
      return updatedRegistration;
    }, 200);

    runs(function(){      
      expect(updatedRegistration.description).toBe('new description');      
    });
  });
  it('should be able to retrieve specific registration', function(){        
    var createdRegistration = null;    
    var retrievedRegistration = null;
    timeregService.post('', {}).on('complete', afterCreation);
    
    function afterCreation(data, resp){    
      createdRegistration = data;
      var getSpecificUrl = data._id;
      timeregService.get(getSpecificUrl, {}).on('complete', specificRetrieved);      
    }

    function specificRetrieved(data, resp){            
      retrievedRegistration = data;
    }
  
    waitsFor(function() {
      return retrievedRegistration;
    }, 200);

    runs(function(){      
      expect(retrievedRegistration._id).toBe(createdRegistration._id);      
    });
  });
  it('should not be able to retrieve deleted registration', function(){        
    var createdRegistration = null;    
    var retrievedRegistration = null;
    var specificUrl = null;

    timeregService.post('', {}).on('complete', afterCreation);    
    function afterCreation(data, resp){          
      specificUrl = data._id;
      timeregService.del(specificUrl, {}).on('complete', deleted);      
    }

    function deleted(data, resp){                  
      timeregService.get(specificUrl, {}).on('4XX', notFound);
    }

    var notThere = null;
    function notFound(){
      notThere = true;
    }
  
    waitsFor(function() {
      return notThere;
    }, 200);

    runs(function(){      
      expect(notThere).toBeTruthy();      
    });
  });
  it('should be possible to retrieve registrations by simple query', function(){
    var rightNow = new Date().getTime();            

    // TODO: a type problem?
    var registration = { description: '' + rightNow };

    timeregService.post('', {data: registration}).on('complete', afterCreation);

    function afterCreation(){
      timeregService.post('', {data: registration}).on('complete', afterCreation2);
    }

    function afterCreation2(){
      timeregService.post('', {data: registration}).on('complete', getRegistrationsByQuery);
    }
    
    function getRegistrationsByQuery(){      
      timeregService.post('query/', {data: registration}).on('complete', setFoundRegistrations);
    }

    var foundRegistrations = null;
    function setFoundRegistrations(data){        
      foundRegistrations = data;  
    }

    waitsFor(function() {
      return foundRegistrations;
    }, 200);

    runs(function(){      
      expect(foundRegistrations.length).toBe(3);      
    });
  });
  it('should not be possible to retrieve registrations from another user', function(){
    
    var registration = {};
    timeregService.post('', {data: registration}).on('complete', afterCreation);

    function afterCreation(data, resp){      
      timeregService2.get(data._id, {}).on('4XX', failedRetrievingFromOtherUser);
    }

    var failedToRetrieve = false;
    function failedRetrievingFromOtherUser(){
      failedToRetrieve = true;
    }
        
    waitsFor(function() {
      return failedToRetrieve;
    }, 200);

    runs(function(){      
      expect(failedToRetrieve).toBeTruthy();      
    });
  });
});
