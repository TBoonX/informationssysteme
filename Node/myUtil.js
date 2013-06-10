/**
 * Utils
 */
//findet indexe von needle in haystack
exports.indexesInString = function(needle, haystack) {
	var indices = [];
	for(var i=0; i<haystack.length;i++) {
	    if (haystack[i] === needle) indices.push(i);
	}
	return indices;
};

//asynchroner Funktionsaufruf
exports.async_function = function(val, callback){
    process.nextTick(function(){
        callback(val);
    });
};

//Wortlisten
exports.wordlists = {
	GER: ['der','die','und','in','den','von','zu','das','mit','sich','des','auf','für','ist','im','dem','nicht','ein','Die','eine','als','auch','es','an','werden','aus','er','hat','daß','sie','nach','wird','bei','einer','Der','um','am','sind','noch','wie','einem','über','einen','Das','so','Sie','zum','war','haben','nur','oder','aber','vor','zur','bis','mehr','durch','man','sein','wurde','sei','In','Prozent','hatte','kann','gegen','vom','können','schon','wenn','habe','seine','Mark','ihre','dann','unter','wir','soll','ich','eines','Es','Jahr','zwei','Jahren','diese','dieser','wieder','keine','Uhr','seiner','worden','Und','will','zwischen','Im','immer','Millionen','Ein','was','sagte'],
	EN: ['the','of','to','and','a','in','for','is','The','that','on','said','with','be','was','by','as','are','at','from','it','has','an','have','will','or','its','he','not','were','which','this','but','can','more','his','been','would','about','their','also','they','million','had','than','up','who','In','one','you','new','A','I','other','year','all','two','S','But','It','company','into','U','Mr.','system','some','when','out','last','only','after','first','time','says','He','years','market','no','over','we','could','if','people','percent','such','This','most','use','because','any','data','there','them','government','may','software','so','New','now','many'],
	
	doForEverything: function(callback) {
		for (var i = 0; i < this.GER.length; i++)
			callback(this.GER[i]);
		for (var i = 0; i < this.EN.length; i++)
			callback(this.EN[i]);
		
	}
};