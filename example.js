const
  scheduler = require('./scheduler'),
  func = function () {
    console.log("I work!");
  };

//if it's 11:00 AM
scheduler(func, 11, 0, 3000);
