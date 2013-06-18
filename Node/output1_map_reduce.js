/**
 * ETL - load
 */

module.mongo = require('./mongohandler.js');

//Map
var map = function() {
	
	var gender = this.value.user.gender;
	var userid = this._id;
	var locations = this.value.locations;
	
	locations.forEach(function(location) {
		var lat = location.location.latitude;
		lat = Math.round(lat*10)*0.1;
		lat = parseFloat(lat.toString().substring(0,6));
		var lon = location.location.longitude;
		lon = Math.round(lon*10)*0.1;
		lon = parseFloat(lon.toString().substring(0,6));
		
		var key = {
			lat: lat,
			lon: lon
		};
		
		var postid = location.ppostid;
		var l = location.location;
		l.nearestStations = undefined;
		var value = {
			userid: userid,
			postid: postid,
			gender: gender,
			location: l
		};
		
		emit(key, value);
	});
};

var reduce = function(k, values) {
	
	var result = {
		genders: {
			male: 0,
			female: 0,
			unknown: 0
		},
		locations: []
	};
	
	values.forEach(function(value) {
		if ("gender" in value) {
			result.genders[value.gender]++;
		}
		if ("location" in value) {
			var l = value.location;
			l.userid = value.userid;
			l.postid = value.postid;
			result.locations.push(l);
		}
	});
	
	return result;
};

console.log('\nMap Reduce on output1\n-------------------\n\n');
module.mongo.removeAll('result_gender', function() {
	module.mongo.mapReduce("output1", map, reduce, "result_gender", function(){
		//clean
		module.mongo.clean('result_gender', ['value.genders']);
	});
});

