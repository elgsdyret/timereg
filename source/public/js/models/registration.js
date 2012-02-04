
TimeReg.Registration = Backbone.Model.extend({
	urlRoot: 'timeregs/',
	defaults: {
		day: 1,
        month: 1,
        year: 2000,
        start: '07:30',
        end: '15:30',
        breakTime: '30m',
        description: ''		
	}
});

TimeReg.Registrations = Backbone.Collection.extend({
	model: TimeReg.Registration	
});