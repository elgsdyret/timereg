
TimeReg.Registration = Backbone.Model.extend({
	urlRoot: 'timeregs/'
});

TimeReg.Registrations = Backbone.Collection.extend({
	model: TimeReg.Registration	
});