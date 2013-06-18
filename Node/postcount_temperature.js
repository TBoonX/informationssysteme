/**
 * ETL - load
 */

module.mongo = require('./mongohandler.js');

//Map
var map = function() {
	
	emit(this.value.averageWeather.temperatur, 1);
};

var reduce = function(k, values) {
	
	var count = values.length;
	
	return count;
};

console.log('\nMap Reduce on result_weather\n-------------------\n\n');
module.mongo.removeAll('temperatures', function() {
	module.mongo.mapReduce("result_weather", map, reduce, "temperatures", function(){
		//clean
		//module.mongo.clean('result_gender', ['value.genders']);
	});
});

