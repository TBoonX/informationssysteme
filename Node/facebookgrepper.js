/**
 * New node file
 */
var https = require("https");
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

console.log('\nFacebook\n-------------------\n\nGet Posts with places or coordinates.\n\n');


var util = require('./myUtil.js');
var pposts = require('./facebook_search_posts_with_locations.js');


process.on('exit', function () {
    console.warn('\nAmount of found data: '+pposts.hits());
	
	console.warn('\n..\nEXIT');
});

//pposts auf Wortlisten ausf�hren
util.wordlists.doForEverything(function(query) {
	pposts.start(query, function(){});
});



//-------------------------------------
//Old

//User Manager
function user_manager () {
	this.count = 0;
	this.ocount = 0;
	this.url = new url_gen();
	this.map = {};
	this.keys = [];
	
	this.add = function(user) {
		this.count++;
		this.ocount++;
		this.keys.push(user.id);
		this.map[user.id] = user;
		
		this.feedbacks[user.id] = 0;
	};
	
	this.remove = function(userid) {
		this.count--;
		this.keys.pop(userid);
		this.map[userid] = undefined;
		
		this.feedbacks[userid] = undefined;
	};
	
	this.addToAttribute = function(elements, attribute, userid) {
		if( !(Object.prototype.toString.call( elements ) === '[object Array]') ) {
		    elements = [elements];
		}
		
		for (var i = 0; i < elements.length; i++)
			this.map[userid][attribute].data.push(elements[i]);
	};
	
	this.feedbacks = {};
	//consumer der Attribute melden sich zur�ck; wenn sich alle gemeldet haben, wird die Person in die DB geschrieben
	this.feedback = function(attribute, userid) {
		this.feedbacks[userid]++;
		
		if (this.feedbacks[userid] < 2)
			return;
		
		//Schreibe in DB
		console.warn('Now write user '+userid+' to the db! And remove him.');
		
		this.remove(userid);
	};
};

user = new user_manager();

count_user = 0;
count_posts = 0;
count_likes = 0; 

//URL-generator
function url_gen () {
	this.fields = 'id,likes,statuses,posts,checkins,activities,name,address,updated_time,first_name,last_name,username,birthday,picture,hometown,gender,locale,locations,relationship_status';
	this.query = 'james';
	this.access_token = 'CAACJ9MUXbwwBAEQs6HrCVqtCsanXobjC5ZBWFkrqcxG4cNG2vJSw3o78gUFKGwuZBxcoyFfiPeHjJoTRaFCMN4MJUVthmv5lEE6kmV0ZAQFZArn7ig5tqC5a5AyBHvnBHIrIaVNRVAqbw3RUsRZBO4WJxfp4ZBoRMZD';
	this.type = 'user';
	this.limit = 1;
	this.offset = 0;
	this.after_id = 0;
	
	this.setQuery = function(q) {
		this.query = q;
	};
	
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
function consumeUser(user_) {
	if (user_.id == undefined)
	{
		console.warn('Error with User');
		console.warn(user_);
		
		return;
	}
	
	console.log('-----------------\nconsume User '+user_.id+'\namount of calls: '+(count_likes+count_user));
	
	//User der map beif�gen
	user.add(user_);
	
	//likes
	consumeLikes(user.likes, user_.id, true);
	
	//posts
	consumePosts(user_.posts, user_.id, true);
	
	//checkins
	if (user_.checkins)
	{
		console.hint('User '+user_id+' has checkins:');
		console.hint(user_.checkins);
	}
	
	//activities
	if (user_.activities)
	{
		console.hint('User '+user_id+' has activities:');
		console.hint(user_.activities);
	}
	
	//statuses
	if (user_.statuses)
	{
		console.hint('User '+user_id+' has statuses:');
		console.hint(user_.statuses);
	}
	
	//locations
	if (user_.locations)
	{
		console.hint('User '+user_id+' has locations:');
		console.hint(user_.locations);
	}
};

//Verarbeite likes
function consumeLikes(likes, id, first) {
	if (!likes || likes == null || likes == undefined || likes.data == undefined || likes.data.length == 0)
	{
		user.feedback('likes', id);
		
		return;
	}
	
	console.log('-----------------\nconsume likes from '+id+' with '+likes.data.length+' elements');
	
	//eventuell likes map beif�gen
	if (!first)
	{
		user.addToAttribute(likes.data, 'likes', id);
	}
	
	//n�chste Daten holen
	//send http
	var indexes = util.indexesInString('=', likes.paging.next);
	var extra = likes.paging.next.substring(indexes[indexes.length-2]+1);
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/'+id+'/likes?limit=5000&access_token='+((new url_gen()).access_token)+'&offset='+extra,
	  method: 'GET'
	};
	
	var buffers = [];
	
	console.log('consumeLikes: call https://'+options.hostname+options.path);
	
	var req = https.request(options, function(res) {
	  console.log("consumeLikes: statusCode: ", res.statusCode);

	  res.on('data', function(d) {
	    console.log('consumeLikes: bytelength: '+d.length);
	    
	    buffers.push(d);
	  });
	  
	  res.on('end', function() {
		  console.warn('consumeLikes: closed!');
		  
		  count_likes++;
		  
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  console.log('consumeLikes: length of all: '+overallb.length);
		  consumeLikes(JSON.parse(overallb), id, false);
	  });
	});
	req.end();

	req.on('error', function(e) {
		console.log('Error with likes of person '+id+': '+ e.message); 
		console.log( e.stack );
		
		user.feedback('likes', id);
	});
};

//Verarbeite posts
function consumePosts(posts, id, first) {
	if (!posts || posts == null || posts == undefined || posts.data == undefined || posts.data.length == 0)
	{
		user.feedback('posts', id);
		
		return;
	}
	
	console.log('-----------------\nconsume posts from '+id+' with '+posts.data.length+' elements');
	
	//eventuell posts map beif�gen
	if (!first)
	{
		user.addToAttribute(posts.data, 'posts', id);
	}
	
	//n�chste Daten holen
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
		  
		  count_posts++;
		  
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
		console.warn('Error with posts of person '+id+': '+ e.message); 
		console.warn( e.stack );
		
		user.feedback('posts', id);
	});
};

//Verarbeite user paging
function consumeUserPaging(paging) {
	/*
	if (user.ocount > 80)
	{	
		for (var i = 0; i < user.keys.length; i++)
		{
			try {
				console.log('user '+user.keys[i]+' has '+user.map[user.keys[i]].posts.data.length+' posts');
			} catch(e) {}
		}
		
		//console.log(user_map);
		return;
	}
	*/
	
	console.log('-----------------\nconsume User Paging; UserCount='+count_user);
	
	//get lastid
	var n = paging.next.lastIndexOf('=');
	user.url.updateExtra(paging.next.substring(n+1));
	
	console.log('get next user with url: '+user.url.gen());
	
	getUser(function(res){
		try {
			consumeUser(res.data[0]);
			consumeUserPaging(res.paging);
		} catch (e) {
			//Fehler mit neuen Daten
			console.warn('Fehler mit User!');
			console.warn(res);
			
			var overall = count_likes+count_posts+count_user;
			console.log('overall requests: '+overall+' with '+count_posts+' posts and '+count_likes+' likes');
			return;
		}
	});
};

//Getter einen User mit der API
function getUser(todo) {
	console.log('-----------------\nget User');
	
	//send http
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/search?'+user.url.gen(),
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
		  
		  count_user++;
		  
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
/*
getUser(function(res){
	console.warn(res);
	
	consumeUserPaging(res.paging);
	consumeUser(res.data[0]);
});
*/


/*
var repeat = false;
//Asynchron countUsers mit offset starten
for (var i = 0; repeat; i=i+25)
{
	
	util.async_function(i, function(o) {
		console.log('.');
		countUsers(o);
	  });
	
	if (i > 15000)
		break;
}
*/

function countUsers(offset)
{
	console.log('-----------------\ncountUsers');
	
	//send http
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/search?fields=from,place,coordinates&q=James&type=post&with=location&access_token=CAACJ9MUXbwwBABmXlOcEXjLBDZBZC2EfIIIbUxuPoGZBUo0nZC0S6Gl04tHhOeFtQdUJHs0NmD36VzehwhLBO0oE06GPzuGzmdLoSJvF4vrtx5v47Wxd9xhZAVkqrmXIoFGBwtkbzrgZCrJZBvHbbOrYPv17nLbpZCcZD&offset='+offset,
	  method: 'GET'
	};
	
	console.warn('call https://'+options.hostname+options.path);
	
	var buffers = [];

	var req = https.request(options, function(res) {
	  console.log("countUsers: statusCode: ", res.statusCode);
	  
	  if (res.statusCode != 200)
	  {
		  console.warn('Error with key!');
		  console.warn(postAccessedCount);
		  console.warn(res);
		  
		  repeat = false;
		  
		  return;
	  }

	  res.on('data', function(d) {
	    console.log('countUsers: bytelength: '+d.length);
	    
	    buffers.push(d);
	  });
	  
	  res.on('end', function() {
		  console.warn('countUsers: closed!');
		  
		  //var overallb = Buffer.concat(buffers, buffers.length);
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  
		  var ret = JSON.parse(overallb);
		  
		  console.log('getPosts: length of all: '+overallb.length);
		  
		  for (i in ret.data)
			  if (ret.data[i].place || ret.data[i].coordinate) console.log(ret.data[i]);
		  
		  try {
			  if (0 == ret.data.length)
			  {
				  repeat = false;console.log('last offset: '+offset);
			  }
		  } catch (e) {repeat = false;console.log('last offset: '+offset);}
	  });
	});
	req.end();

	req.on('error', function(e) {
		console.log("getPosts Error: " + e.message); 
		   console.log( e.stack );
	});
};