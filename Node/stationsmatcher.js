/**
 * Match weatherstationsdata with pposts. 
 */
module.util = require('./myUtil.js');
module.mongo = require('./mongohandler.js');

module.stations = {};

process.on('exit', function () {
    console.info('\nAmount of matched pposts: '+module.successCount);
	
	console.info('\n..\nEXIT');
});

exports.start = function() {
	console.log('\nMatch PPosts with weatherstations\n-------------------\n\n');
	
	//Get all stations
	module.mongo.getAllFromCollection('relevant_stations', module.continueWithStations);
};

//Save stations and continue with pposts
module.continueWithStations = function(stations) {
	module.stations = stations;
	
	//Get all pposts
	module.mongo.getAllFromCollection('pposts', module.continueWithPPosts);
};

module.successCount = 0;

//do job for each ppost
module.continueWithPPosts = function(pposts) {
	//var ppost = pposts[13];console.log(ppost);
	
	var count = 0;
	pposts.forEach(function(ppost) {
		if (count%1000 == 0)
			console.log(count+' stations ...');
		count++;
		
		var id = ppost._id;
		var location, from;
		try {
			location = ppost.place.location;
			//from = ppost.from;
			
			if (!location.latitude)
				throw "No lonlat in "+ppost._id;
			
			//get nearest stations
			var stations = module.getNextStations(location);
			
			//update ppost
			module.mongo.update('pposts', {_id:ppost._id}, {$set: {"place.location.nearestStations":stations}});
			
			module.successCount++;
		} catch (e) {
			//continue - do nothing
			console.info(e);
		}
	});
	
	console.log('forEach at end');
};

//Loop through stations and return the ids of the 3 nearest stations
module.getNextStations = function(location) {
	var distances = {};
	
	//calc all distances
	module.stations.forEach(function(station) {
		distances[station.stationid] = module.getDistanceBetween(location, {latitude: station.lat, longitude: station.lon});
	});
	
	var stations = [];
	
	var l = 999999999.9;
	var id = 0;
	
	//search nearest station-id
	for (i in distances) {
		if (distances[i] < l)
		{
			l = distances[i];
			id = i;
		}
	};
	stations.push({id:id, distance:l});
	distances[id] = undefined;
	l = 999999999.9;

	//search second nearest station-id
	for (i in distances) {
		if (distances[i] < l)
		{
			l = distances[i];
			id = i;
		}
	};
	stations.push({id:id, distance:l});
	distances[id] = undefined;
	l = 999999999.9;

	//search third nearest station-id
	for (i in distances) {
		if (distances[i] < l)
		{
			l = distances[i];
			id = i;
		}
	};
	stations.push({id:id, distance:l});
	distances[id] = undefined;
	
	return stations;
};

module.getDistanceBetween = function(loc1, loc2) {
	var x1 = loc1.latitude,
	x2 = loc2.latitude,
	y1 = loc1.longitude,
	y2 = loc2.longitude;
	
	var dx = 0, dy = 0;
	
	if ((x1 > 0 && x2 > 0) || (x1 < 0 && x2 < 0))
		dx = Math.abs(x1-x2);
	else if (x1 > 0 && x2 < 0)
		dx = Math.abs(x1-x2);
	else	//x1 < 0 && x2 > 0
		dx = Math.abs(-x1+x2);
	
	if ((y1 > 0 && y2 > 0) || (y1 < 0 && y2 < 0))
		dy = Math.abs(y1-y2);
	else if (y1 > 0 && y2 < 0)
		dy = Math.abs(y1-y2);
	else	//y1 < 0 && y2 > 0
		dy = Math.abs(-y1+y2);
	
	var distance = Math.sqrt(dx*dx+dy*dy);
	
	return distance;
};

//console.log('Distance between 3,-4 and -6,8 is '+module.getDistance({latitude:3, longitude:-4}, {latitude:-6, longitude:8}));

exports.start();