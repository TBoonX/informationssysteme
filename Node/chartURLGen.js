

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  /**
   * https://chart.googleapis.com/chart?cht=p3&chs=700x400&chd=t:60,30,10&chl=41%20grad|40grad%20|37%20grad
   * //chart.googleapis.com/chart?chxr=0,-29,41&chxs=0,676767,10.5,0,l,676767|1,676767,10.5,0,lt,676767&chxt=x,y&chs=440x220&cht=lc&chco=3072F3&chds=-29,41&chd=t:-29,1,1,12,20,6,40,5&chdl=Posts&chdlp=b&chls=2,4,1&chma=5,5,5,25|0,5
   * //chart.googleapis.com/chart?chxr=0,-30,50|1,0,30&chxt=x,y&chs=680x340&cht=lxy&chco=3072F3&chds=-30,50,0,30&chd=t:-29,0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41|1,1,1,10,10,6,7,8,19,16,2,4,13,25,20,22,16,16,16,15,16,21,12,13,25,19,10,11,2,3,16,22,18,12,13,8,3,5,2,3,1,3&chdl=Posts&chdlp=b&chg=5,10&chls=2&chma=5,5,5,25|0,5&chtt=Amount+of+posts+at+specific+temperatures
   */
  var mongo = require('./mongohandler.js');
  
  var url = '';

  mongo.getAllFromCollection('temperatures', function(elements) {
  	var ex = {};
  	var count = 0;
  	
  	var temperatures = '';
  	var counts = '';
  	var c_max = t_max = -999, t_min = c_min = 999;
  	
  	elements.forEach(function(e) {
  		if (e._id > -200 && e._id < 60)
  		{
  			if (t_min > e._id)
  				t_min = e._id;
  			if (t_max < e._id)
  				t_max = e._id;
  			if (c_min > e.value)
  				c_min = e.value;
  			if (c_max < e.value)
  				c_max = e.value;
  			
  			temperatures += e._id+',';
  			counts += e.value+',';
  		}
  		
  		
  	});
  	//console.log(t_min+' '+t_max+' '+c_min+' '+c_max);
  	temperatures = temperatures.substring(0, temperatures.length-1);
  	counts = counts.substring(0, counts.length-1);
  	
  	//console.log('https://chart.googleapis.com/chart?chs=500x300&cht=lxy&chco=3072F3&chds=0,100,-30,50&chdl=Test&chdlp=b&chls=2,4,1&chma=5,5,5,25&chd=t:'+temperatures+'|'+counts);
  	console.log('https://chart.googleapis.com/chart?chxr=0,'+(t_min-1)+','+(t_max+1)+'|1,0,'+(c_max+1)+'&chxt=x,y&chs=680x340&cht=lxy&chco=3072F3&chds='+(t_min-1)+','+(t_max+1)+','+(c_min-1)+','+(c_max+1)+'&chd=t:'+temperatures+'|'+counts+'&chdl=Posts&chdlp=b&chg=5,10&chls=2&chma=5,5,5,25|0,5&chtt=Amount+of+posts+at+specific+temperatures');
  	
  	url = 'https://chart.googleapis.com/chart?chxr=0,'+(t_min-1)+','+(t_max+1)+'|1,0,'+(c_max+1)+'&chxt=x,y&chs=680x340&cht=lxy&chco=3072F3&chds='+(t_min-1)+','+(t_max+1)+','+(c_min-1)+','+(c_max+1)+'&chd=t:'+temperatures+'|'+counts+'&chdl=Posts&chdlp=b&chg=5,10&chls=2&chma=5,5,5,25|0,5&chtt=Amount+of+posts+at+specific+temperatures';
  });
  
  res.end('<html><body><img src="'+url+'">Diagramm</img></body></html>');
}).listen(66879, '192.168.1.7');
