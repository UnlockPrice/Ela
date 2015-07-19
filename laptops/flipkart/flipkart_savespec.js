var	http = require('https');
var	mysql = require('mysql');
var excluded = require('./flipkart_scrapobj.js').excluded;
var lov = require('./flipkart_scrapobj.js').lov;
var config = require('../../config/config.js');

var specId = '';
var pool = '';

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
	//console.log('getSpecifications');
	var count=0;
	var counter=0;
	var index = 0;
	var excludedOutput = "";
	for(var key in obj){
		count++;
	}
	if(count==0){
		console.log('NA:'+productIndex);
		callback(productIndex,category, "",-1,-1);
		return;
	}
	pool.getConnection(function(err,connection){
		if (err) {
			console.log('savepec;ERROR: '+err);
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			callback(productIndex,category,"",-1,-1);
			return;
		}
		
		var specsArr={};
		var prime_mul = 1;
		var specIdStr = "";
		for(var key in obj){
			if( (category in excluded) && ( excluded[category].indexOf(key)!= -1) )
			{
				if(obj[key])
				{
					excludedOutput += "_"+obj[key];
					specsArr[key] = obj[key];
				}
				counter++;
				if(count==counter){
					connection.release();
					
					
					excludedOutput = excludedOutput+"_";
					
					if (prime_mul == 1)
						prime_mul = -1;
					
					callback(productIndex, category, specsArr,prime_mul,excludedOutput);
					break;
				}
				continue;
			}
			var myparams = "'"+category+"','"+key+"','"+obj[key]+"'";
			
			connection.query("call sp_saveSpecification_new("+myparams+",@spectype_out,@specvalue_out)", function(err, result) {
				if (err) {
					console.log('ERROR: '+err);
					connection.release();
					return;
				}   
				counter++;
				var spectype_out = result[0][0].spectype_out;
				var specvalue_out = result[0][0].specvalue_out;
				if(specvalue_out)
				{
					specsArr[spectype_out]=specvalue_out;
					//prime_mul = prime_mul*parseInt(specId);
					index++;
				}
				if(count==counter){
					connection.release();
					
					excludedOutput = excludedOutput+"_";
					
					if (prime_mul == 1)
						prime_mul = -1;
					
					callback(productIndex,category, specsArr,prime_mul,excludedOutput);
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