var
  moment = require('moment')
, R = require('ramda')
, async = require('async')
, log = console.log
, logI = x => {log(x); return x;} 
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
				format = "MM/DD/YYYY HH:mm:ss.SSS",
    	  now = moment().format(format),
    	  isRightTime = now >= obj.lowerBound && now <= obj.upperBound,
    	  isRightDay = obj.weekends ? true : moment().day() != 0 && moment().day() != 6,
    	  triggered = isRightDay && isRightTime,
				setColor = "\x1b["+obj.color+"m",
				resetColor = "\x1b[0m",
				functionName = setColor + obj.func.name + resetColor,
				triggerTime = obj.hour + ": " + obj.minute,
				lowerBoundTime = moment(obj.lowerBound, format).format("hh:mm a"),
				upperBoundTime = moment(obj.upperBound, format).format("hh:mm a"),
				day = moment(obj.upperBound, format).format("ddd MMM Do"),
				range = setColor + lowerBoundTime + resetColor + " and " + setColor + upperBoundTime + resetColor + " on " + day 
				;
			
    	if(triggered) {
    	  log(obj.func.name + " triggered at " + now);
    	  obj.func();
    	} else {
    	  log (now + ": running...will trigger " + functionName + " between " + range);
    	}

			return cb()
		}
	}
, checkTime = function (funcObjects, interval) { 
		const 
		colorNums = [31, 32, 33, 34, 35, 36],
		index = Math.round(Math.random() * (colorNums.length-1)),
		asyncFuncs = R.pipe(
				R.map(x => {x.color=colorNums[index]; return x})
			, R.map(getAsyncFunctions)
			)(R.map(getBounds(interval), funcObjects))	
		;

		async.series(asyncFuncs, function (err, results) {
			if(err) log(err);
			setTimeout(checkTime.bind(this, funcObjects, interval), interval);		
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
			, format = "MM/DD/YYYY"
			, date = obj.date ? moment().date(obj.date).format(format) : moment().format(format)
			, lowerBound = moment(date, format)
					.hour(obj.hour - timeObj.h)
					.minute(obj.minute - timeObj.m)
					.seconds(0 - timeObj.s)
					.milliseconds(0 - timeObj.ms)
					.format("MM/DD/YYYY HH:mm:ss.SSS")
			, upperBound = moment(date, format)
					.hour(obj.hour + timeObj.h)
					.minute(obj.minute + timeObj.m)
					.seconds(timeObj.s)
					.milliseconds(timeObj.ms)
					.format("MM/DD/YYYY HH:mm:ss.SSS")
			;

		obj.lowerBound = lowerBound;
		obj.upperBound = upperBound;
		return obj;
 	})
, logTimes = function (obj) {
		const 
			format = "ddd MMM Do"
		, date = obj.date ? moment().date(obj.date).format(format) : moment().format(format);
		log("running. " + obj.func.name + " will be triggered around " + obj.hour + ":" + obj.minute + " on " + date);
	}
, main = function (objs, interval = 600000){
		
		const funcObjects = R.map(getDefaults, objs);

		funcObjects.forEach(logTimes);
    setTimeout(checkTime.bind(this, funcObjects, interval), interval);
  }
, nil = null;

module.exports = main;
