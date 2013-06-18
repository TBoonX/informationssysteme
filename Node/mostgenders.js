/**
 * New node file
 */
module.mongo = require('./mongohandler.js');

module.selected = [];

module.mongo.getAllFromCollection('result_gender', function(elements) {
	elements.forEach(function(a){
		var c = 0;
		c = c+parseInt(a.value.genders.male);
		c = c+parseInt(a.value.genders.female);
		c = c+parseInt(a.value.genders.unknown);
		var x = {};
		x._id = a._id;
		x.count = c;
		x.genders = a.value.genders;
		
		if (c > 6) 
			module.selected.push(x);
	});
	
	console.log('durch');
	console.log(module.selected);
});