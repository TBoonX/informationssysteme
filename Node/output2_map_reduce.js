/**
 * ETL - load
 */

module.mongo = require('./mongohandler.js');

//Map
var map = function() {
	
	var weather = this.value.weather;
	var locations = this.value.locations;
	var stationid = this._id.stationid;
	
	var dateConsumer = function(ct) {
		var year = ct.substring(0,4);
		var month = ct.substring(5,7);
		var day = ct.substring(8,10);
		var hour = ct.substring(11,13);
		
		return {
			year: year,
			month: month,
			day: day
			,hour: hour
		};
	};
	
	locations.forEach(function(location) {
		var l = location.location;
		var stations = l.nearestStations;
		var postid = location.ppostid;
		var date = location.date;
		var date_o = dateConsumer(date);
		
		var distance;
		stations.forEach(function(a) {
			if (a.id == stationid)
			{
				distance = a.distance;
			}
		});
		
		var i = 0;
		var w = {
			temperature: -999999,
			pressure: -9999999,
			wind: -9999999
		};
		
		var diff = 24;
		for(; i < weather.length; i++)
		{
			var weat = weather[i];
			
			if (date_o.hour == weat.hour)
			{
				w.pressure = weat.pressure;
				w.wind = weat.wind;
				w.temperature = weat.temperature;
				
				break;
			}
			else
			{
				var d = Math.abs(date_o.hour-weat.hour);
				
				if (d < diff)
				{
					w.pressure = weat.pressure;
					w.wind = weat.wind;
					w.temperature = weat.temperature;
					
					diff = d;
				}
			}
		}
		
		l.nearestStations = undefined;
		
		var value = {
			weather: w,
			location: l,
			distance: distance
		};
		
		emit(postid, value);
	});
};

var reduce = function(k, values) {
	
	var result = {
		
		location: null,
		
		concreteWeather: [],
		
		averageWeather: {}
		
	};
	
	values.forEach(function(value) {
		if ( ("weather" in value) && ("location" in value) &&("distance" in value)) {
			if (result.location && ( result.location.latitude != value.location.latitude || result.location.longitude != value.location.longitude )  )
				throw 'difference in location';
			
			result.location = value.location;
			var w = value.weather;
			w.distance = value.distance;
			result.concreteWeather.push(w);
		}
		else if (("concreteWeather" in value)) {
			result.concreteWeather = result.concreteWeather.concat(value.concreteWeather);
		}
	});
	
	//calc average weather
	//get distances
	var overalldistance = 0;
	result.concreteWeather.forEach(function(weather) {
		overalldistance += weather.distance;
	});
	
	var buf_wind = 0;
	var buf_temp = 0;
	var buf_pres = 0;
	
	result.concreteWeather.forEach(function(weather) {
		buf_wind += weather.wind*weather.distance;
		buf_temp += weather.temperature*weather.distance;
		buf_pres += weather.pressure*weather.distance;
		
	});
	buf_wind /= overalldistance;
	buf_temp /= overalldistance;
	buf_pres /= overalldistance;
	
	result.averageWeather.wind = buf_wind;
	result.averageWeather.pressure = buf_pres;
	result.averageWeather.temperature = buf_temp/10;
	
	
	return result;
};

console.log('\nMap Reduce on output2\n-------------------\n\n');
module.mongo.removeAll('result_weather', function() {
	module.mongo.mapReduce("output2", map, reduce, "result_weather", function(){
		//clean
		//module.mongo.clean('result_weather', ['']);
	});
});