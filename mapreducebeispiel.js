var map_posts = function(){ emit(this.from.id), {lat:this.place.location.lat, lon:this.place.location.lon, other:{country:this.place.location.country,state:this.place.location.state,}};};
var map_user = function(){ emit(this._id, {gender:this.gender});};
var reduce = function(k, values) {

var result = {};

values.forEach(function(value) {
	var field;
	if ("lat" in value) {
		if (!("comments" in result)) {
			result.comments = [];
		}
		result.comments.push(value);
	} else if ("gender" in value) {
		if (!("gender" in result)) {
			result.gender = [];
		}
		result.gender.push.apply(result.gender, value.comments);
	}
	for (field in value) {
		if (value.hasOwnProperty(field) && !(field in commentFields)) {
			result[field] = value[field];
		}
	}
});

return result;
};

db.pposts.mapReduce(map, reduce);









> db.test2
db.test2.save({ "_id" : 1, "name" : "Kurt", "gender" : "male" });
db.test2.save({ "_id" : 2, "name" : "Marcel", "gender" : "male" });
db.test2.save({ "_id" : 3, "name" : "Anika", "gender" : "female" });
> db.test1
db.test1.save({"_id": ObjectId("51bb8b2f34ad77e5b67c73e0"),"id": 3,"place": {"location": {"latitude": 1,"longitude": 1,"other": "bla"}},"from": {"name": "Anika","id": 3}});
db.test1.save({"_id": ObjectId("51bb8b3634ad77e5b67c73e1"),  "id": 2,  "place": {    "location": {      "latitude": 2,      "longitude": 2,      "other": "bla2"    }  },  "from": {    "name": "Marcel",    "id": 2  }});
db.test1.save({  "_id": ObjectId("51bb8a5434ad77e5b67c73de"),  "from": {    "name": "Kurt",    "id": 1  },  "id": 1,  "place": {    "location": {      "country": "Germany",      "latitude": 1,      "longitude": 1,      "more": true,      "other": "bla"    }  }});