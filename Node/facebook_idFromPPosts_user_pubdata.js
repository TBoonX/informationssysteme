/**
 * Get public user data from users with id in pposts.from.
 * Read all ids from mongodb and then worf async and get everything
 */

module.util = require('./myUtil.js');
module.secret = require('./secret.js');
module.mongo = require('./mongohandler.js');
module.https = require("https");

module.idCount = 0;
module.userConsumedCount = 0;

process.on('exit', function () {
    console.info('\nAmount of found users: '+module.userConsumedCount);
	
	console.info('\n..\nEXIT');
});

exports.start = function() {
	console.log('\nFacebook\n-------------------\n\nRead PPosts...');
	
	module.mongo.getAllUseridsFromPPosts(function(ids) {
		module.idCount = ids.length;
		
		console.log('\nGet '+module.idCount+' Users from PPosts.\n\n');
		
		module.consumeAllIds(ids);
		
		//process.exit(0);
	});
};
module.start = 0;module.end = 0;
//Je 36 Ids parallel abfragen, je 5s warten
module.consumeAllIds = function(ids) {
	
	//Test
	//ids.forEach(function(id){
	for (var i = 0; i<ids.length; i++) {
		var id = ids[i];
		console.info('Get User with id '+id+'.');
		module.getUserBy(id);
	}
	//});
	
	return;
	var l = ids.length;
	var i;
	for (i = 0; i < l; i = i+36)
	{
		module.end = (l > (i+36)) ? (i+35) : (l-1);
		module.start = i;
		setTimeout(function(){
			module.execPack(ids, module.start, module.end);
		  },
		  module.start*50
		);
	}
};

module.execPack = function(ids, a, b) {
	console.log('execPack ids from '+a+' to '+b);
	//console.log(ids);
	var j;
	for (j = a; j < b; j++)
	{
		var index = j;
		console.log('id at index '+index);
		console.info('Get User with id '+ids[index]+'.');
		module.getUserBy(ids[index]);
	}
};

module.getUserBy = function(id) {
	module.userConsumedCount++;
	
	//send http
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/'+id+'?fields=id,name,first_name,last_name,username,birthday,address,picture,work,hometown,gender,link,locale,relationship_status&method=GET&format=json&access_token='+module.secret.apiKey,
	  method: 'GET'
	};
	//console.info(options);
	var buffers = [];
	
	//definiere request
	var req = module.https.request(options, function(res) {
	  res.on('data', function(d) {
	    buffers.push(d);
	  });
	  
	  //Bytes einsammeln
	  res.on('end', function() {
		  //module.reqCount[query]++;
		  
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  //parsen
		  var ret = {};
		  try {
			  ret = JSON.parse(overallb);

			  //Wiederholung bei Fehler 613 (600 per 600s)
			  if (ret.error && ret.error.code == 613)
			  {
				  setTimeout(function(){
					  console.info('! "'+id+'" have to wait (too many requests per 600s)...');
					  module.getUserBy(id);
				  }, 10000+parseInt(Math.random()*10000));
				  return;
			  }
			  //Wiederholung bei Fehler 4 (100Million/10k per Day)
			  if (ret.error && ret.error.code == 613)
			  {
				  setTimeout(function(){
					  console.info('! "'+id+'" have to wait (too many requests per key)...');
					  module.getUserBy(id);
				  }, 180000+parseInt(Math.random()*40000));
				  return;
			  }
			  //Wiederholung bei Fehler 109 (temporally server error)
			  if (ret.error && ret.error.code == 109)
			  {
				  setTimeout(function(){
					  console.info('! "'+id+'" have to wait (temp error)...');
					  module.getUserBy(id);
				  }, 5000+parseInt(Math.random()*5000));
				  return;
			  }
			  //Ausgabe bei Fehler 100 (wrong fields)
			  if (ret.error && ret.error.code == 100)
			  {
				  //module.fail({stack: '? Wrong URL? -> https://'+options.hostname+options.path}, id);
				  
				  //Mostly an app instead of an user
				  module.consumeOtherData({id: id}, id);
				  
				  return;
			  }
			  
			  //Abbruch bei fehlerhaftem Key
			  if (ret.error && ret.error.type == 'OAuthException')
			  {
				  module.fail({stack: ret}, id);
				  return;
			  }
		  } catch (e) {
			  //Too many requests
			  //repeat
			  setTimeout(function(){
				  console.info('! "'+id+'" have to wait (too many requests)...');
				  console.log(e);
				  module.getUserBy(id);
			  }, 10000+parseInt(Math.random()*10000));
			  
			  //module.fail(e, query);
			  return;
		  }
		  
		  //asyncron weiterverfahren
		  module.util.async_function({ret: ret, id: id}, function(r) {
			  
			  try {
				  //Abbruch bei leeren Daten
				  if (!r.ret || !r.ret.id || !r.ret.picture)
				  {
					  module.fail({stack: '-> User-PPosts: empty Data - query: '+r.id}, r.id);
					  return;
				  }
				  
				  //Daten verarbeiten
				  if (!r.ret.picture.data.is_silhouette)
						module.consumeData(r.ret, r.id);
			  }catch(e){module.fail(e, r.id);}
		  });		  
	  });
	});
	
	//Request starten
	req.end();

	//Fehlerhandling
	req.on('error', function(e) {module.fail(e, id);});
};

//Verarbeite gefundene Daten
module.consumeData = function(data, id) {
	//module.exports.hitCount[query]++;
	console.log('-> User-PPosts: found userdata');
	
	module.mongo.saveElement(data, 'user');
};

//Verarbeite gefundene Daten
module.consumeOtherData = function(data, id) {
	//module.exports.hitCount[query]++;
	console.log('-> User-PPosts: found other data');
	
	module.mongo.saveElement(data, 'apps');
};

//Fehlerhandling
module.fail = function(e, id) {
	console.info('!!! User-PPosts: Error! - id '+id); 
	console.info( e.stack );
	console.info('\n');
	
	//Callback
	//module.callbacks[query](query);
};


//
exports.start();
