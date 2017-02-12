var clock;

(function($) {
	$(function() {
		//get the time(s)
		var nowDate = new Date();
		var dnumNow = nowDate.getTime();
		var targetDate = new Date(2017, 1, 14, 18, 0);
		var dnumTarget = targetDate.getTime();
		//caculate the time until target time
		var diff2Dates = (dnumTarget - dnumNow) / 1000;
		if (dnumTarget < dnumNow) {
				diff2Dates *= -1;
		}
		//init the clock object
		clock  = $('.flip-counter').FlipClock({
			clockFace: 'DailyCounter',
			autoStart: true
		});
		clock.setTime(diff2Dates);
		clock.setCountdown(true);
	});

}(jQuery));
