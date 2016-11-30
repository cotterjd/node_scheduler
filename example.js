const
  scheduler = require('./scheduler'),
  func = function () {
    console.log("I work!");
  };

//if it's 11:00 AM (pass in 22 if it's 11pm). 
//3000 is just for testing. scheduler(func, 11, 0) is all you would want for a daily task running at 11ish everyday
scheduler(func, 11, 0, 3000);
