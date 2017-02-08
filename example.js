const
  scheduler = require('./scheduler'),
  func = function () {
    console.log("I work!");
  };

//if it's 11:00 AM (pass in 22 if it's 11pm). 
//3000 is just for testing. It means the scheduler will check the time every 3 seconds to see if it's time to run the function
//600000 (10 minutes) is the default if left blank.
scheduler(func, 15, 28, 3000);
