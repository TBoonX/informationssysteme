/**
 * New node file
 */
var https = require("https");

var connectionString = "mongodb://infosys:InfoKirsten321@127.0.0.1"; // "username:password@example.com/mydb"
var collections = ["test"];
var mongojs = require('mongojs');
//var db = mongojs(connectionString, collections);
var db = mongojs('infosys:InfoKirsten321@127.0.0.1/test', ['test', 'test_locations']);

/*
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
user_count = 0;
user_url = new url_gen();
user_map = {};
user_map_keys = [];

//URL-generator
function url_gen () {
	this.fields = 'id,likes,statuses,checkins,posts,name,address,first_name,last_name,username,birthday,picture,hometown,gender,locale,locations,relationship_status';
	this.query = 'james';
	this.access_token = '';
	this.type = 'user';
	this.limit = 1;
	this.offset = 0;
	this.after_id = 0;
	
	this.updateExtra = function(afterid) {
		this.offset++;
		this.after_id = afterid;
	};
	
	this.gen = function() {
		var extra = '';
		
		if (this.offset > 0)
			extra = 'offset='+this.offset+'&__after_id='+this.after_id;
		
		return 'fields='+this.fields+'&q='+this.query+'&limit='+this.limit+'&type='+this.type+'&access_token='+this.access_token+'&'+extra;
	};
};

//Verarbeite User
function consumeUser(user) {
	console.log('-----------------\nconsume User '+user.id);
	
	//User der map beifügen
	user_map[user.id] = user;
	user_map_keys.push(user.id);
	
	//likes
	//consumeLikes(user.likes, user.id, true);
	
	//posts
	consumePosts(user.posts, user.id, true);
	
	//checkins
	
	
	//statuses
	
	
	//locations
	
	
	
};

//Verarbeite likes
function consumeLikes(likes, id, first) {
	if (!likes || likes == null || likes == undefined)
		return;
	
	console.log('consume Likes from '+id);
	
	if (!first)
	{
		user_map[id].likes.push(likes.data);
	}
	
	//...
};

//Verarbeite posts
function consumePosts(posts, id, first) {
	if (!posts || posts == null || posts == undefined || posts.data == undefined || posts.data.length == 0)
		return;
	
	console.log('-----------------\nconsume posts from '+id+' with '+posts.data.length+' elements');
	
	//eventuell posts map beifügen
	if (!first)
	{
		for (var i = 0; i < posts.data.length; i++)
			user_map[id].posts.data.push(posts.data[i]);
	}
	
	//nächste Daten holen
	//send http
	var n = posts.paging.next.lastIndexOf('=');
	var until = posts.paging.next.substring(n+1);
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/'+id+'/posts?limit=1&access_token='+((new url_gen()).access_token)+'&until='+until,
	  method: 'GET'
	};
	
	var buffers = [];
	
	console.log('consumePosts: call https://'+options.hostname+options.path);
	
	var req = https.request(options, function(res) {
	  console.log("consumePosts: statusCode: ", res.statusCode);

	  res.on('data', function(d) {
	    console.log('consumePosts: bytelength: '+d.length);
	    
	    buffers.push(d);
	  });
	  
	  res.on('end', function() {
		  console.warn('consumePosts: closed!');
		  
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  console.log('consumePosts: length of all: '+overallb.length);
		  consumePosts(JSON.parse(overallb), id, false);
	  });
	});
	req.end();

	req.on('error', function(e) {
		console.log('Error with posts of person '+id+': '+ e.message); 
		console.log( e.stack );
	});
};

//Verarbeite user paging
function consumeUserPaging(paging) {
	if (user_count > 8)
	{	
		for (var i = 0; i < user_map_keys.length; i++)
		{
			try {
				console.log('user '+user_map_keys[i]+' has '+user_map[user_map_keys[i]].posts.data.length+' posts');
			} catch(e) {}
		}
		
		//console.log(user_map);
		return;
	}
	
	console.log('-----------------\nconsume User Paging');
	
	//get lastid
	var n = paging.next.lastIndexOf('=');
	user_url.updateExtra(paging.next.substring(n+1));
	
	console.log('get next user with url: ');
	console.log(user_url);
	
	getUser(function(res){
		consumeUser(res.data[0]);
		consumeUserPaging(res.paging);
	});
};

//Getter einen User mit der API
function getUser( todo) {
	console.log('-----------------\nget User');
	
	//send http
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/search?'+user_url.gen(),
	  method: 'GET'
	};
	
	var buffers = [];

	var req = https.request(options, function(res) {
	  console.log("getUser: statusCode: ", res.statusCode);

	  res.on('data', function(d) {
	    console.log('getUser: bytelength: '+d.length);
	    
	    buffers.push(d);
	  });
	  
	  res.on('end', function() {
		  console.warn('getUser: closed!');
		  
		  user_count++;
		  
		  //var overallb = Buffer.concat(buffers, buffers.length);
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  console.log('getUser: length of all: '+overallb.length);
		  todo(JSON.parse(overallb));
	  });
	});
	req.end();

	req.on('error', function(e) {
		console.log("Error: " + e.message); 
		   console.log( e.stack );
	});
}

//Start
getUser(function(res, url_gen_loc){
	console.warn(res);
	
	consumeUserPaging(res.paging);
	consumeUser(res.data[0]);
});
