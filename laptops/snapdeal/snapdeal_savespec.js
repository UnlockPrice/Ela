var	http = require('https');
var	mysql = require('mysql');
var excluded = require('./snapdeal_scrapobj.js').excluded;
var lov = require('./snapdeal_scrapobj.js').lov;
var config = require('../../config/config.js');

var specId='';
var pool='';


exports.initialize = function (){
	//console.log('specification initialize');
	
	pool      =    mysql.createPool({
			connectionLimit : 30, //important
		host     : config.host, 
		user     : config.user, 
		password : config.password,  
		database : config.database,
		multipleStatements:true
	});
	
}
exports.saveSpecifications = function(productIndex,obj,category, callback){
	
	var count=0;
	var counter=0;
	var index=0;
	var excludedOutput = "";
	for(var key in obj){
		count++;
	}
	if(count==0){
		console.log('NA:'+productIndex);
		callback(productIndex,category, -1,-1,-1);
		return;
	}
	pool.getConnection(function(err,connection){
		if (err) {
			console.log('ERROR: '+err);
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			callback(productIndex,category, -1,-1,-1);
			return;
		}
		
		var specsArr=[];
		var prime_mul = 1;
		var specIdStr = "";
		for(var key in obj){
			
			if( (category in excluded) && ( excluded[category].indexOf(key)!= -1) )
			{
				if(obj[key])
				{
					excludedOutput += "_"+obj[key];
				}
				counter++;
				if(count==counter){
					connection.release();
					if (specsArr.length > 0)
					specIdStr = "_"+specsArr.join('_')+"_";
					else 
					specIdStr = 'NA';
					
					excludedOutput = excludedOutput+"_";
					
					if (prime_mul == 1)
					prime_mul = -1;
					
					callback(productIndex,category, specIdStr,prime_mul,excludedOutput);
					break;
				}
				continue;
			}
			var myparams = "'"+category+"','"+key+"','"+obj[key]+"'";
			
			connection.query("call sp_saveSpecification("+myparams+",@specid)", function(err, result) {
				if (err) {
					console.log('ERROR: '+err);
					connection.release();
					return;
				}   
				counter++;
				var specId = result[0][0].specId;
				if(specId)
				{
					specsArr[index]=specId;
					prime_mul = prime_mul*parseInt(specId);
					index++;
				}
				if(count==counter){
					connection.release();
					if (specsArr.length > 0)
						specIdStr = "_"+specsArr.join('_')+"_";
					else 
						specIdStr = -1;
					
					excludedOutput = excludedOutput+"_";
					
					if (prime_mul == 1)
						prime_mul = -1;
					
					//console.log(specIdStr+":"+prime_mul+":"+excludedOutput);
					callback(productIndex,category, specIdStr,prime_mul,excludedOutput);
					return;
				}	
			});
		}
	});
	//return specId;
}

parseSpecId = function(result){
	if(result && (Array.isArray(result) || typeof(result)=='object')){
		for(var index in result){
			if(index=='specId'){
				return result[index];
				}else{
				var retVal = parseSpecId(result[index]);
				if(retVal!=undefined){
					return retVal;
				}
			}
		}
	}
}

function testfun(productIndex, specIdStr){
	console.log('time'+specIdStr);
}
function sortFunc(a,b){
	return a-b;
}