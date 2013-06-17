/**
 * ETL
 */

module.mongo = require('./mongohandler.js');

//Map
var map_posts = function() {
	
	if (!this.place || !this.place.location || !this.place.location.latitude || !this.from || !this.from.id)
		return;
	
	var values = {
			location: this.place.location,
			date: this.created_time,
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

console.log('\nMap Reduce on pposts and user\n-------------------\n\n');

//db.pposts.mapReduce(map, reduce, {"out": { "reduce": "output" }});
module.mongo.mapReduce("user", map_user, reduce, "output1", function(){
	module.mongo.mapReduce("pposts", map_posts, reduce, "output1", function(){
		//clean
		module.mongo.clean('output1', ['value.locations', 'value.user']);
	});
});
