/**
 * Match weather with pposts
 */
module.mongo = require('./mongohandler.js');

//get all of output1
module.outputs = {};

module.mongo.getAllFromCollection('output1', function(elements) {
	
});