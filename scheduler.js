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
, setColor = x => "\x1b["+x+"m"
, resetColor = () => "\x1b[0m"
, longFormat = "MM/DD/YYYY HH:mm:ss:SSS"
, getAsyncFunctions = function (obj) {
     return function (cb) {
      const
        now = moment().format(longFormat),
        isRightTime = now >= obj.lowerBound && now <= obj.upperBound,
        isRightDay = obj.weekends ? true : moment().day() != 0 && moment().day() != 6,
        triggered = isRightDay && isRightTime,
    setcolor = setColor(obj.color),
    functionName = setcolor + obj.func.name + resetColor(),
    triggerTime = obj.hour + ": " + obj.minute,
    lowerBoundTime = moment(obj.lowerBound, longFormat).format("hh:mm a"),
    upperBoundTime = moment(obj.upperBound, longFormat).format("hh:mm a"),
    day = moment(obj.upperBound, longFormat).format("ddd MMM Do"),
    range = setcolor + lowerBoundTime + resetColor() + " and " + setcolor + upperBoundTime + resetColor() + " on " + day 
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
, randomColorNum = function () {
  const 
    colorNums = [31, 32, 33, 34, 35, 36]
    , index = Math.round(Math.random() * (colorNums.length-1));

    return colorNums[index];
  }
, checkTime = function (funcObjects, interval) { 
  const 
    color = randomColorNum(),
    asyncFuncs = R.pipe(
                      R.map(x => {x.color=color; return x})
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
, triggerDateObject = (obj) => {
    if (obj.date) return moment().date(obj.date).hour(obj.hour).minute(obj.minute).format(longFormat);
    else throw "No date property on object"
  }
, today = f => moment().format(f)
, getBounds = R.curry(function (interval, obj) {
    const 
        timeObj = makeConversions(interval/2)
      , triggerDayHasPassed = obj.date ? triggerDateObject(obj) < today(longFormat) : false
      , incrementMonth = moment().month(moment().month() + 1).date(obj.date || moment().date()).format(longFormat)
      , format = "MM/DD/YYYY"
      , date = obj.date ? 
          (triggerDayHasPassed ? incrementMonth : moment().date(obj.date).format(longFormat)) : 
          today(longFormat)
      , lowerBound = moment(date, longFormat)
          .hour(obj.hour - timeObj.h)
          .minute(obj.minute - timeObj.m)
          .seconds(0 - timeObj.s)
          .milliseconds(0 - timeObj.ms)
          .format(longFormat)
      , upperBound = moment(date, longFormat)
          .hour(obj.hour + timeObj.h)
          .minute(obj.minute + timeObj.m)
          .seconds(timeObj.s)
          .milliseconds(timeObj.ms)
          .format(longFormat)
      ;

    obj.lowerBound = lowerBound;
    obj.upperBound = upperBound;
    return obj;
  })
, logTimes = R.curry(function (color, obj) {
    const 
      format = "ddd MMM Do"
    , date = obj.date ? (triggerDateObject(obj) < moment().format(longFormat) ? moment().month(moment().month() + 1).date(obj.date).format(format) : moment().date(obj.date).format(format)) : moment().format(format);
    log("running. " + setColor(color) + obj.func.name + resetColor() + " will be triggered around " + setColor(color) + obj.hour + ":" + obj.minute + resetColor() + " on " + date);
  })
, main = function (objs, interval = 600000){
    
    const funcObjects = R.map(getDefaults, objs);

    funcObjects.forEach(logTimes(randomColorNum()));
    setTimeout(checkTime.bind(this, funcObjects, interval), interval);
  }
, nil = null;

module.exports = main;
