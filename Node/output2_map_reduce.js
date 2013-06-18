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
			temperatur: -9999,
			pressure: -9999,
			wind: -9999
		};
		
		var diff = 24;
		for(; i < weather.length; i++)
		{
			var weat = weather[i];
			
			if (date_o.hour == weat.hour)
			{
				w.pressure = weat.pressure;
				w.wind = weat.windspeed;
				w.temperatur = weat.temperatur;
				
				break;
			}
			else
			{
				var d = Math.abs(date_o.hour-weat.hour);
				
				if (d < diff)
				{
					w.pressure = weat.pressure;
					w.wind = weat.windspeed;
					w.temperatur = weat.temperatur;
					
					diff = d;
				}
			}
		}
		
		l.nearestStations = undefined;
		
		var value = {
			weather: w,
			location: l,
			distance: distance,
			created_time: date
		};
		
		emit(postid, value);
	});
};

var reduce = function(k, values) {
	
	var result = {
		
		location: null,
		
		created_time: '',
		
		concreteWeather: [],
		
		averageWeather: {}
		
	};
	
	values.forEach(function(value) {
		if ( ("weather" in value) && ("location" in value) && ("distance" in value)) {
			if (result.location && ( result.location.latitude != value.location.latitude || result.location.longitude != value.location.longitude )  )
				throw 'difference in location';
			
			result.location = value.location;
			var w = value.weather;
			w.distance = value.distance;
			result.concreteWeather.push(w);
			
			if (result.created_time && result.created_time != value.created_time )
				throw 'difference in created_time';
			
			result.created_time = value.created_time;
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
		if (parseInt(weather.wind) != -9999)
			buf_wind += parseInt(weather.wind)*weather.distance;
		if (parseInt(weather.temperatur) != -9999)
			buf_temp += parseInt(weather.temperatur)*weather.distance;
		if (parseInt(weather.pressure) != -9999)
			buf_pres += parseInt(weather.pressure)*weather.distance;
		
	});
	buf_wind /= overalldistance;
	buf_temp /= overalldistance;
	buf_pres /= overalldistance;
	
	result.averageWeather.wind = Math.round(buf_wind/10);
	result.averageWeather.pressure = Math.round(buf_pres);
	result.averageWeather.temperatur = Math.round(buf_temp/10);
	
	
	return result;
};

console.log('\nMap Reduce on output2\n-------------------\n\n');
module.mongo.removeAll('result_weather', function() {
	module.mongo.mapReduce("output2", map, reduce, "result_weather", function(){
		//clean
		module.mongo.clean('result_weather', ['value.averageWeather']);
	});
});