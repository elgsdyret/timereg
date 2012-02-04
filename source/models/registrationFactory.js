
module.exports = function(){
	var _ = require('underscore');
	var timeReg = {
            day: 1,
            month: 1,
            year: 2000,
            start: '07:30',
            end: '15:30',
            breakTime: '30m',
            description: 'default'            
    };

	return {
		forToday: function() {
			var timeNow = new Date();

			return _({}).extend(timeReg, {
				day: timeNow.getDate(),
				month: timeNow.getMonth(),
				year: timeNow.getFullYear()
			})
		},
		default: function() {
			return _({}).extend(timeReg);
		}
	};
};

