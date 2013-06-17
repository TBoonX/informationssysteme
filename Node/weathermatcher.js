/**
 * Match weather with pposts
 * @depreced
 */
module.mongo = require('./mongohandler.js');

//get all of output1
module.outputs = {};

console.log('\nCombine pposts with wetter\n-------------------\n\n');

module.mongo.find('pposts', {"place.location.latitude": {$exists:true}, created_time: {$exists: true}, "place.location.nearestStations": { $exists:true }}, { _id:1, created_time:1, "place.location":1 }, function(pposts) {
	console.log('first element: ');
	console.log(pposts[1000]);
	
	//var d = module.consumeCT(pposts[1000].created_time);
	//console.log(d);
	
	//module.getWeather(pposts[1000].place.location.nearestStations, d);
	
	//return;
	
	var count = 0;
	
	pposts.forEach(function(ppost) {
		//get date
		var date = ppost.created_time;
		
		//String to object
		var date_o = module.consumeCT(date);
		
		//get weather
		module.getWeather(ppost.place.location.nearestStations, date_o);
		
		count++;
		console.log('ppost nr. '+count);
	});
	
	console.log('\nEnd');
});

module.consumeCT = function(ct) {
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

module.getWeather = function(stations, date) {
	
	stations.forEach(function(station) {
		//console.log('get weather from ');
		var filter = { stationid: station.id, year: date.year, month: date.month, day: date.day, hour: date.hour };
		//console.log(filter);
		
		module.mongo.find('wetter', filter, { press:1, temp:1, wind:1 }, function(elements) {
			//console.log(elements);
			
			if (elements.length > 0)
				console.log(elements.length+' data for '+station.id);
		});
	})

};

//stations: 83746, 83566, 83779