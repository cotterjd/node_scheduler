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
		minute: 59,
		weekends: true
	}, 
	obj1 = {
		func: func1,
		hour: 16,
		minute: 58,
		weekends: true
	}, 
	obj2 = {
		func: func2,
		hour: 16,
		minute: 59,
		weekends: true
	}
	funcs = [obj0, obj1, obj2]
	;

//if it's 11:00 AM (pass in 22 if it's 11pm). 
//3000 is just for testing. It means the scheduler will check the time every 3 seconds to see if it's time to run the function
//600000 (10 minutes) is the default if left blank.
scheduler(funcs, 3000);
