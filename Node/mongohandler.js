/**
 * Mongohandler
 */
var secret = require('./secret.js');
var collections = ["test", "pposts", "posts", "locations", "wstations"];
var mongojs = require('mongojs');
module.db = mongojs(secret.mongoDBConStr, collections);

//Macht aus id _id
module.objectIdTo_id = function (object) {
	var newObject = {};
	for (i in object) {
		if (i == 'id')
		{
			newObject['_id'] = object[i];
		}
		else
			newObject[i] = object[i];
	}
	return newObject;
};

//nimmt fehlerhafte updates auf
module.failedUpdates = [];

exports.saveElement = function(element, collection) {
	//mache id zu id_
	element = module.objectIdTo_id(element);
	
	module.db[collection].save(element, function(err, saved) {
	 if( err || !saved ) {
		  console.info("!!! Update on DB failed!");
		  module.failedUpdates.push(element);
		  console.info(err);
	  }
	});
};


//exports.saveElement({a:1,test:'Kurt'}, 'test');
//exports.saveElement({id:878732189723987213,a:1,test:'Marcel'}, 'test');