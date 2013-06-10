/**
 * With the help of a wordlist and a given connection to the mongoDB, this module gets public posts and insert posts with places or coordinates into the mongoDB.
 */

module.util = require('./myUtil.js');
module.secret = require('./secret.js');
module.mongo = require('./mongohandler.js');
module.https = require("https");

module.optionsGen = function(query)
{
	return {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: '/search?fields=from,place,coordinates&q='+query+'&type=post&with=location&access_token='+module.secret.personalApiKey,
	  method: 'GET'
	};
};

module.reqCount = {};
module.hitCount = {};
module.map = {};
module.callbacks = {};

module.consumePostsTest = function(next, query) {
	//Abbruch, wenn map es sagt
	if (!module.map[query])
		return;
	
	//nächste Daten holen
	//send http
	var options = {
	  hostname: 'graph.facebook.com',
	  port: 443,
	  path: next.substring(26),
	  method: 'GET'
	};
	//console.warn(options);
	var buffers = [];
	
	//definiere request
	var req = module.https.request(options, function(res) {
	  res.on('data', function(d) {
	    buffers.push(d);
	  });
	  
	  //Bytes einsammeln
	  res.on('end', function() {
		  module.reqCount[query]++;
		  
		  var overallb = '';
		  for (var i = 0; i < buffers.length; i++)
		  {
			  overallb = overallb+buffers[i].toString('utf8');
		  }
		  
		  //parsen
		  var ret = {};
		  try {
			  var ret = JSON.parse(overallb);
			  
			  //Abbruch bei fehlerhaftem Key
			  if (ret .error && ret.error.type == 'OAuthException')
			  {
				  module.fail({stack: ret}, query);
				  return;
			  }
		  } catch (e) {
			  module.fail(e, query);
			  return;
		  }
		  
		  //asyncron weiterverfahren
		  module.util.async_function({ret: ret, query: query}, function(r) {
			  
			  try {
				  //Abbruch bei leeren Daten
				  if (r.ret && r.ret.data && r.ret.data.length == 0)
				  {
					  module.fail({stack: '-> PPosts: emtpy Data - query: '+r.query}, r.query);
					  return;
				  }
				  
				  module.util.async_function({next: r.ret.paging.next, query: r.query}, function(n) {
					  module.consumePostsTest(n.next, n.query);
				  });
				  
				  for (i in r.ret.data)
				  {
					if (r.ret.data[i].place || r.ret.data[i].coordinates)
						module.consumeData(r.ret.data[i], r.query);
				  }
			  }catch(e){module.fail(e, r.query);}
		  });		  
	  });
	});
	
	//Request starten
	req.end();

	//Fehlerhandling
	req.on('error', function(e) {module.fail(e, query);});
};

//Verarbeite gefundene Daten
module.consumeData = function(data, query) {
	module.hitCount[query]++;
	console.log('-> PPosts: found element; count: '+module.hitCount[query]);
	
	module.mongo.saveElement(data, 'pposts');
	
};

//Fehlerhandling
module.fail = function(e, query) {
	console.warn('PPost: Error!'); 
	console.warn( e.stack );
	console.warn('\n');
	
	//Callback
	module.callbacks[query]();
};

//Abbruch 
exports.exit = function(query) {
	module.map[query] = false;
};

//start
exports.start = function(query, callback) {
	console.log('-> Get posts (PPosts) with locations; query: '+query);
	
	//create options
	var options = module.optionsGen(query);
	
	//reg map
	module.map[query] = true;
	
	//reg callbacks
	module.callbacks[query] = callback;
	
	//reg counts
	module.reqCount[query] = 0;
	module.hitCount[query] = 0;
	
	//Start Snake
	module.consumePostsTest('https://'+options.hostname+options.path, query);
};

//Test
//exports.start('James', function(){});