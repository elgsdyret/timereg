

TimeReg = {};
TimeReg.App = function($){
	
	var run = function(){		
		var registration = new TimeReg.Registration({type: 'dummy'});
		var createDefaultTodayView = new TimeReg.CreateDefaultTodayView({model: registration});
		var $appContainer = $('#appContainer');
		$appContainer.html(createDefaultTodayView.render().el);
	};

	return { run: run };

}($);
