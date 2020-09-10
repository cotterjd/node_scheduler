//example is for running functions at 4:30 pm. 
const
  scheduler = require('./scheduler'),
  func = function () {
    console.log("I work!");
  },
  func1 = function () {
    console.log("I also work!");
  }, 
  func2 = function () {
    console.log("I work too!");
  },
  obj0 = {
    func: func,
    hour: 16,
    minute: 30,
    weekends: true, //will run on weekends also
    date: 14  //will only run on the 14th of each month
  }, 
  obj1 = {
    func: func1,
    hour: 16,
    minute: 30,
    date: 15  //will not run on weekends even if the 15th falls on a weekend since weekends is not set to true
  }, 
  //will run at 4:30 every day including weekends
  obj2 = {
    func: func2,
    hour: 16,
    minute: 30,
    weekends: true,
  }
  funcs = [obj0, obj1, obj2]
  ;

//3000 is just for testing. It means the scheduler will check the time every 3 seconds to see if it's time to run the function
//600000 (10 minutes) is the default if left blank.
scheduler(funcs, 3000);
