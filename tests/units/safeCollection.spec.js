
describe('/timereg/source/mongo/safeCollection', function(){
	
	var collection = null, safeCollection = null;
	var initialize = function(){
		initialize = function() {};
		collection = jasmine.createSpyObj('collection', ['find', 'findOne', 'insert', 'update', 'findAndModify']);
		safeCollection = require('../../source/mongo/safeCollection')('testId', collection);			
	};

	beforeEach(initialize);
	it('will ensure that find is not called with only a callback', function() {				
		var callback = function(){};
		
		safeCollection.find(callback);

		expect(collection.find.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});	
	it('will ensure that find is not called with null as selector', function() {
		var callback = function(){};
		
		safeCollection.find(null, callback);

		expect(collection.find.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that a find selector has _userId added', function() {
		var callback = function(){};
		var selector = { name: 'test'};

		safeCollection.find(selector, callback);

		expect(collection.find.mostRecentCall.args[0]).toEqual({_userId: 'testId', name: 'test'});
	});
	it('will ensure that findOne is not called with only a callback', function() {				
		var callback = function(){};
		
		safeCollection.findOne(callback);

		expect(collection.findOne.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});	
	it('will ensure that findOne is not called with null as selector', function() {
		var callback = function(){};
		
		safeCollection.findOne(null, callback);

		expect(collection.findOne.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that a findOne selector has _userId added', function() {
		var callback = function(){};
		var selector = { name: 'test'};

		safeCollection.findOne(selector, callback);

		expect(collection.findOne.mostRecentCall.args[0]).toEqual({_userId: 'testId', name: 'test'});
	});
	it('will ensure that a single document given to insert has _userId added', function() {
		var callback = function(){};
		var doc = { name: 'test'};

		safeCollection.insert(doc);

		expect(collection.insert.mostRecentCall.args[0]).toEqual([{_userId: 'testId', name: 'test'}]);
	});
	it('will ensure that a single document given to insert has _userId added even if it has _userId', function() {
		var callback = function(){};
		var doc = { name: 'test', _userId: 'some other user'};

		safeCollection.insert(doc);

		expect(collection.insert.mostRecentCall.args[0]).toEqual([{_userId: 'testId', name: 'test'}]);
	});
	it('will ensure that a list of documents given to insert all have _userId added', function() {
		var callback = function(){};
		var docs = [{ name: 'test'}, { name: 'test2'}];

		safeCollection.insert(docs);

		expect(collection.insert.mostRecentCall.args[0]).toEqual([{_userId: 'testId', name: 'test'}, {_userId: 'testId', name: 'test2'}]);
	});
	it('will ensure that update selector is made safe', function(){
		var selector = {};
		var doc = { name: 'test'};

		safeCollection.update(selector, doc);

		expect(collection.update.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that update selector is made safe even if it has _userId', function(){
		var selector = { _userId: 'testIdSomeOther' };
		var doc = { name: 'test' };

		safeCollection.update(selector, doc);

		expect(collection.update.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that update document is made safe', function(){
		var selector = {};
		var doc = { name: 'test'};

		safeCollection.update(selector, doc);

		expect(collection.update.mostRecentCall.args[1]).toEqual({name: 'test', _userId: 'testId'});
	});
	it('will ensure that update document is made safe even if it has _userId', function(){
		var selector = {};
		var doc = { name: 'test', _userId: 'some other user'};

		safeCollection.update(selector, doc);

		expect(collection.update.mostRecentCall.args[1]).toEqual({name: 'test', _userId: 'testId'});
	});
	it('will ensure that findAndModify query is made safe', function(){
		var query = {};
		
		safeCollection.findAndModify(query);

		expect(collection.findAndModify.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that findAndModify query is made safe even if it has _userId', function(){
		var query = { _userId: 'testIdSomeOther' };
		
		safeCollection.findAndModify(query);

		expect(collection.findAndModify.mostRecentCall.args[0]).toEqual({_userId: 'testId'});
	});
	it('will ensure that findAndModify document is made safe', function(){
		var query = {};
		var doc = { name: 'test'};

		safeCollection.findAndModify(query, {}, doc);

		expect(collection.findAndModify.mostRecentCall.args[2]).toEqual({name: 'test', _userId: 'testId'});
	});
	it('will ensure that findAndModify document is made safe even if it has _userId', function(){
		var query = {};
		var doc = { name: 'test', _userId: 'other user'};

		safeCollection.findAndModify(query, {}, doc);

		expect(collection.findAndModify.mostRecentCall.args[2]).toEqual({name: 'test', _userId: 'testId'});
	});
});

