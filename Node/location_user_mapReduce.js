/**
 * ETL
 */

module.mongo = require('./mongohandler.js');

//Map
var map_posts = function() {
	
	if (!this.place || !this.place.location || !this.place.location.latitude || !this.from || !this.from.id)
		return;
	
	var location = {
		latitude: this.place.location.latitude,
		longitude: this.place.location.longitude,
		address: {}
	};
	

	try {
		location.address.country = this.place.location.country;
	} catch (e) {
	}
	try {
		location.address.state = this.place.location.state;
	} catch (e) {
	}
	try {
		location.address.city = this.place.location.city;
	} catch (e) {
	}
	try {
		location.address.zip = this.place.location.zip;
	} catch (e) {
	}
	try {
		location.address.street = this.place.location.street;
	} catch (e) {
	}
	
	
	var values = {
			location: location,
			date: this.cerated_time,
			ppostid: this._id
	};
	
	emit(this.from.id, values);
};

//Map
var map_user = function(){
	
	var values = {gender: "unknown"};
	
	try {
		if (this.gender)
			values.gender = this.gender;
	} catch(e) {}
	
	emit(this._id, values);
};

var reduce = function(k, values) {
	
	var result = {};
	
	values.forEach(function(value) {
		if ("gender" in value) {
			if (!result.user)
				result.user = {};
			result.user.gender = value.gender;
		}
		else if ("location" in value) {
			if (!("locations" in result)) {
				result.locations = [];
			}
			result.locations.push(value);
		}
	});
	
	return result;
};

//db.pposts.mapReduce(map, reduce, {"out": { "reduce": "output" }});
module.mongo.mapReduce("test2", map_user, reduce, "output1");
module.mongo.mapReduce("test1", map_posts, reduce, "output1");