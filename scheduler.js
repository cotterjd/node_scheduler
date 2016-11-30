const
  moment = require('moment')
, log = console.log
, checkEvery_minutes = 10
, timeoutFunc = function (func, hour, minute, interval) { 
    const
      now = moment().format("HH:mm"),
      triggerTime = moment().hour(hour).minute(minute).format("HH:mm"),
      fiveTil = moment().hour(hour).minute(minute - checkEvery_minutes/2).format("HH:mm"),
      fiveAfter = moment().hour(hour).minute(minute + checkEvery_minutes/2).format("HH:mm"),
      isRightTime = now > fiveTil && now < fiveAfter,
      isRightDay = moment().day() != 0 && moment().day() != 6,
      triggered = isRightDay && isRightTime;
		
    if(triggered) {
      log("triggered at " + moment().format("MM/DD/YYYY HH:mm:ss"));
      func();
    } else {
      log (moment().format("MM/DD/YYYY HH:mm:ss") + ": running...waiting for next trigger at " + triggerTime);
    }
    checkTime(func, hour, minute, interval);
  }
, checkTime = function checkTime (func, hour, minute, interval){
    hour = hour || 8;
    minute = minute || 30;
    interval = interval || 600000;
    setTimeout(timeoutFunc.bind(this, func, hour, minute, interval), interval);
  }

, nil = null;

module.exports = checkTime 
