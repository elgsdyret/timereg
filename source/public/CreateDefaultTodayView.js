
TimeReg.CreateDefaultTodayView = Backbone.View.extend({
	template: _.template("<input class='saveButton' type='button' value='Create time registration for today'> </input>"),
	events: {
		'click .saveButton': 'save'	
	},
	render: function(){
		$(this.el).html(this.template);
		return this;	
	},
	save: function(){						
		this.model.save();		
	}	
});

