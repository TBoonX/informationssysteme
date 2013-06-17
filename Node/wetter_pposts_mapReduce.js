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
		var hour = ct.substring(11,13);
		
		return {
			year: year,
			month: month,
			day: day,
			hour: hour
		};
	};
	
	//loop through stations
	this.place.location.nearestStations.forEach(function(station) {
		var key = dateConsumer(this.created_time);
		key.stationid = station.id;
		
		emit(key, values);
	});
	
};

//Map
var map_wetter = function(){
	
	var values = {
			pressure: this.press,
			windspeed: this.wind,
			temperatur: this.temp
	};
	
	var key = {
			stationid: this.stationid,
			year: this.year,
			month: this.month,
			day: this.day,
			hour: this.hour
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
			result.location.push(value);
		}
		else if ("temperatur" in value) {
			result.weather = value;
		}
	});
	
	return result;
};

console.log('\nMap Reduce on pposts and wetter\n-------------------\n\n');

//db.pposts.mapReduce(map, reduce, {"out": { "reduce": "output" }});
module.mongo.mapReduce("wetter", map_wetter, reduce, "output2");
//module.mongo.mapReduce("pposts", map_posts, reduce, "output2");