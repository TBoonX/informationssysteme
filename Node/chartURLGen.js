/**
 * https://chart.googleapis.com/chart?cht=p3&chs=700x400&chd=t:60,30,10&chl=41%20grad|40grad%20|37%20grad
 */
var https = require("https");
var mongo = require('./mongohandler.js');

mongo.getAllFromCollection('temperatures', function(elements) {
	var ex = {};
	var count = 0;
	elements.forEach(function(e) {
		if (e._id > -200 && e._id < 150)
		{
			ex[e._id] = e.value;
			
			count += e.value;
		}
	});
	
	console.log('count: '+count+'\n');
	
	var procent = '', names = '';
	var overallpro = 0;
	for (c in ex)
	{
		var p = Math.round((ex[c]/count)*100);
		
		procent += p+',';
		names += c+' Grad|';
		
		
	}
	
	procent = procent.substring(0, procent.length-1);
	names = names.substring(0, names.length-1);
	
	console.log(procent);
	console.log(names);
});

/*
		var options = {
		  hostname: 'chart.googleapis.com',
		  port: 443,
		  path: '/chart?cht=p3&chs=700x400&chd=t:',
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

*/