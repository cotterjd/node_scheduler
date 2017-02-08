var
  moment = require('moment')
, log = console.log
, firstRun = true 
, makeConversions = function (milliseconds) {
		const
			ms= Math.floor((milliseconds%1000)),
			s = Math.floor((milliseconds/1000)%60),
			m = Math.floor((milliseconds/(1000*60))%24),
			h = Math.floor((milliseconds/(1000*60*60))%24);

			return {
				ms: ms,
				s: s,
				m: m,
				h: h
			}
	}
, timeoutFunc = function (func, hour, minute, interval, lowerBound, upperBound, weekends) { 
    const
      now = moment().format("HH:mm:ss.SSS"),
      isRightTime = now >= lowerBound && now <= upperBound,
      isRightDay = weekends ? true : moment().day() != 0 && moment().day() != 6,
      triggered = isRightDay && isRightTime;
		
    if(triggered) {
      log("triggered at " + moment().format("MM/DD/YYYY HH:mm:ss.SSS"));
      func();
    	checkTime(func, hour, minute, interval);
    } else {
      log (moment().format("MM/DD/YYYY HH:mm:ss.SSS") + ": running...will trigger between " + lowerBound + " and " + upperBound);
    	checkTime(func, hour, minute, interval, weekends);
    }
  }
, checkTime = function checkTime (func, hour, minute, interval, weekends){
    hour = hour != null ? hour : 8;
    minute = minute != null ? minute : 30;
    interval = interval != null ? interval : 600000;
		
		const 
			  timeObj = makeConversions(interval/2)
			, lowerBound = moment()
					.hour(hour - timeObj.h)
					.minute(minute - timeObj.m)
					.seconds(0 - timeObj.s)
					.milliseconds(0 - timeObj.ms)
					.format("HH:mm:ss.SSS")
			, upperBound = moment()
					.hour(hour + timeObj.h)
					.minute(minute + timeObj.m)
					.seconds(timeObj.s)
					.milliseconds(timeObj.ms)
					.format("HH:mm:ss.SSS")
    if (firstRun) {
			log (moment().format("MM/DD/YYYY HH:mm:ss.SSS") 
				+ ": running...will trigger between " 
				+ lowerBound + " and " + upperBound);
			firstRun = false;
		}
    setTimeout(timeoutFunc.bind(this, func, hour, minute, interval, lowerBound, upperBound, weekends), interval);
  }
, nil = null;

module.exports = checkTime 
