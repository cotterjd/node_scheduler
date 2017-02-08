var
  moment = require('moment')
, R = require('ramda')
, async = require('async')
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
, getAsyncFunctions = function (obj) {
		return function (cb) {
    	const
    	  now = moment().format("MM/DD/YYYY HH:mm:ss.SSS"),
    	  isRightTime = now >= obj.lowerBound && now <= obj.upperBound,
    	  isRightDay = obj.weekends ? true : moment().day() != 0 && moment().day() != 6,
    	  triggered = isRightDay && isRightTime;
			
    	if(triggered) {
    	  log(obj.func.name + " triggered at " + now);
    	  obj.func();
    	} else {
    	  log (now + ": running...will trigger " + obj.func.name + " between " + obj.lowerBound + " and " + obj.upperBound);
    	}

			return cb()
		}
	}
, checkTime = function (funcs, interval) { 
		const asyncFuncs = R.map(getAsyncFunctions, funcs)	
		;

		async.series(asyncFuncs, function (err, results) {
			if(err) log(err);
			setTimeout(checkTime.bind(this, funcs, interval), interval);		
		});
  }
, getDefaults = function (obj) {
		obj.hour = obj.hour != null ? obj.hour : 8;
		obj.minute = obj.minute != null ? obj.minute : 30;
		return obj;
 	}
, getBounds = R.curry(function (interval, obj) {
		const 
			  timeObj = makeConversions(interval/2)
			, lowerBound = moment()
					.hour(obj.hour - timeObj.h)
					.minute(obj.minute - timeObj.m)
					.seconds(0 - timeObj.s)
					.milliseconds(0 - timeObj.ms)
					.format("MM/DD/YYYY HH:mm:ss.SSS")
			, upperBound = moment()
					.hour(obj.hour + timeObj.h)
					.minute(obj.minute + timeObj.m)
					.seconds(timeObj.s)
					.milliseconds(timeObj.ms)
					.format("MM/DD/YYYY HH:mm:ss.SSS")
			;

		log (moment().format("MM/DD/YYYY HH:mm:ss.SSS") 
			+ ": running...will trigger " + obj.func.name + " between " 
			+ lowerBound + " and " + upperBound);
		obj.lowerBound = lowerBound;
		obj.upperBound = upperBound;
		return obj;
 	})
, main = function (funcs, interval){
    interval = interval != null ? interval : 600000;
		
		const funcObjects = R.pipe(R.map(getDefaults), R.map(getBounds(interval)))(funcs)
    setTimeout(checkTime.bind(this, funcObjects, interval), interval);
  }
, nil = null;

module.exports = main;
