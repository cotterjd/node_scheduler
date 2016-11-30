const
  scheduler = require('./scheduler'),
  func = function () {
    console.log("I work!");
  };

//if it's 11:00 AM (pass in 22 if it's 11pm)
scheduler(func, 11, 0, 3000);
