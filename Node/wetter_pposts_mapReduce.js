/**
 * Map/Reduce for wetter and pposts
 * ETL
 */


module.mongo = require('./mongohandler.js');

//Map
var map_posts = function() {
	
	if (!this.place || !this.place.location || !this.place.location.latitude || !this.place.location.nearestStations)
		return;
	
	var values = {
			location: this.place.location,
			date: this.created_time,
			ppostid: this._id
	};
	
	var dateConsumer = function(ct) {
		var year = ct.substring(0,4);
		var month = ct.substring(5,7);
		var day = ct.substring(8,10);
		//var hour = ct.substring(11,13);
		
		return {
			year: year,
			month: month,
			day: day
			//,hour: hour
		};
	};
	
	var date = this.created_time;
	
	//loop through stations
	this.place.location.nearestStations.forEach(function(station) {
		try {
			var key = dateConsumer(date);
			key.stationid = station.id;
			
			emit(key, values);
		} catch(e) {  }
	});
	
};

//Map
var map_wetter = function(){
	
	var values = {
			pressure: this.press.replace(" ", ""),	//remove whitespaces
			windspeed: this.wind.replace(" ", ""),
			temperatur: this.temp.replace(" ", ""),
			hour: this.hour
	};
	
	var key = {
			year: this.year,
			month: this.month,
			day: this.day,
			//hour: this.hour,
			stationid: this.stationid
	};
	
	
	emit(key, values);
};

var reduce = function(k, values) {
	
	var result = {};
	
	values.forEach(function(value) {
		if ("location" in value) {
			if (!("locations" in result)) {
				result.locations = [];
			}
			result.locations.push(value);
		}
		if ("temperatur" in value) {
			if (!("weather" in result)) {
				result.weather = [];
			}
			result.weather.push(value);
		}
		if ("weather" in value)
		{
			if (!("weather" in result)) {
				result.weather = [];
			}
			//result.weather.push.apply(result.weather, value.weather);
			result.weather = result.weather.concat(value.weather);
		}
		if ("locations" in value)
		{
			if (!("locations" in result)) {
				result.locations = [];
			}
			//result.locations.push.apply(result.locations, value.locations);
			result.locations = result.locations.concat(value.locations);
		}
	});
	
	return result;
};

console.log('\nMap Reduce on pposts and wetter_2013\n-------------------\n\n');

//db.pposts.mapReduce(map, reduce, {"out": { "reduce": "output" }});
module.mongo.mapReduce("wetter_2013", map_wetter, reduce, "output2", function() {
	module.mongo.mapReduce("pposts", map_posts, reduce, "output2", function(){
		module.mongo.clean('output2', ['value.weather', 'value.locations']);
	});
});
/*
module.mongo.mapReduce("pposts", map_posts, reduce, "output2", function(){
		module.mongo.clean('output2', ['value.weather', 'value.locations']);
	});
*/