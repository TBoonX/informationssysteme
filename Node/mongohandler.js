/**
 * Mongohandler
 */
var secret = require('./secret.js');
var mongojs = require('mongojs');
module.db = mongojs(secret.mongoDBConStr, secret.collections);

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

exports.getAllUseridsFromPPosts = function(callback) {
	module.db.pposts.find(function(err, pposts) {
	  var ids = [];
	  if( err || !pposts) console.info("Could not read all pposts!");
	  else pposts.forEach( function(ppost) {
		  try{ids.push(parseInt(ppost.from.id));}catch(e){console.info(e);}
	  });
	  callback(ids);
	});
};

exports.getAllFromCollection = function(collection, callback) {
	module.db[collection].find(function(err, elements) {
	  if( err || !elements)
		  console.info("Could not read all elements of collection "+collection+"!");
	  else
		  callback(elements);
	});
};

exports.find = function(collection, filter, callback) {
	module.db[collection].find(filter, function(err, elements) {
		if( err || !elements)
			  console.info("Could not find elements of collection "+collection+"!");
	    else
		      callback(elements);
	});
};

exports.update = function(collection, filter, update) {
	module.db[collection].update(filter, update, function(err) {
		if (err)
			console.info('!!! Could not update: '+err);
	});
};

exports.mapReduce = function(collection, map, reduce, outputcollection) {
	module.db[collection].mapReduce(map, reduce, {out: {reduce: outputcollection}, verbose:true}, function(err) {
		if (err)
			console.info('!!! mapReduce error: '+err);
		else
			console.info('mapReduce finish');
	});
};

//Test
/*
exports.getAllUseridsFromPPosts(function(ids) {
	console.log('Count of all userids: '+ids.length);
});
*/

//exports.saveElement({a:1,test:'Kurt'}, 'test');
//exports.saveElement({id:878732189723987213,a:1,test:'Marcel'}, 'test');


/*
var connectionString = "mongodb://infosys:InfoKirsten321@127.0.0.1"; // "username:password@example.com/mydb"
var collections = ["test"];
var mongojs = require('mongojs');
//var db = mongojs(connectionString, collections);
var db = mongojs('infosys:InfoKirsten321@127.0.0.1/test', ['test', 'test_locations']);


db.test.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
 console.log(err);
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.test.find({sex: "male"}, function(err, users) {
  if( err || !users) console.log("No male users found");
  else users.forEach( function(maleUser) {
    console.log(maleUser);
  } );
});

db.test.update({email: "srirangan@gmail.com"}, {$set: {sex: "female"}}, function(err, updated) {
  if( err || !updated ) console.log("User not updated");
  else console.log("User updated");
});

db.test.find({sex: "male"}, function(err, users) {
  if( err || !users) console.log("No male users found");
  else users.forEach( function(maleUser) {
    console.log(maleUser);
  } );
});
*/

/*
db.test_locations.save({
	
});
*/