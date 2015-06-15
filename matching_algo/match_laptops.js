var	mysql = require('mysql');
var config = require('../config/config.js');
var fs = require('fs');
var funcs = require('./laptops_functions.js');
var rules = require('./laptops_rules.js').rules;
var pool      =    mysql.createPool({
	//	connectionLimit : 30, //important
	host     : config.host, 
	user     : config.user, 
	password : config.password,  
	database : config.database,
	multipleStatements:true
});
var matches = [];	
var d = new Date();
var startTime = d.getTime();

fs.writeFile('laptops_match.txt', '');
var count = 0;
var sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price` from	`sepp_product_flipkart` where `category`='laptops' ";
pool.query(sql, function(err, result) 
{
	if (err) console.log(err);
	
	var sql1 = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price`  from	`sepp_product_snapdeal` where `category`='laptops' ";
	pool.query(sql1, function(err1, result1) 
	{
		var out = "";
		
		loop1:for(var i=0;i<result.length;i++)
		{
			var arr1 = JSON.parse(result[i].spec_id);
			arr1["title"]=result[i].title;
			loop2:for(var k=0;k<rules['laptops'].length;k++)
			{
				loop3:for(var j=0;j<result1.length;j++)
				{
					var arr2 = JSON.parse(result1[j].spec_id);
					arr2["title"] = result1[j].title;
					//console.log(rules['laptops'].length);
					
					if ( funcs.decodeRules(arr1,arr2,rules['laptops'][k]) )
					{
						out += result[i].title+ "::"+ result1[j].title+"\n";
						//out += result[i].product_identifier+ "::"+ result1[j].product_identifier+"\n";
						break loop2;
					}
					
					
					/*
						if( keyAndEqualExists ("brand",arr1,arr1["brand"],arr2,arr2["brand"]) )
					{
					if( keyAndEqualExists("modelname",arr1,arr1["modelname"],arr2,arr2["modelname"]) && keyAndEqualExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) )
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					else if( arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelid"],arr2["title"]) && keyAndEqualExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndEqualExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndEqualExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndEqualExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]))
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					else if( keyAndSubstringExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"])  && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
					{
					
					out += result[i].title+ "::"+ result1[j].title+"\n";
					
					}
					else if( arr1.hasOwnProperty("modelname") && arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelname"],arr2["title"]) && substringExists(arr1["modelid"],arr2["title"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					
					}
					*/
				}
				
				
			}
		}
		fs.appendFile('laptops_match.txt', out, function (err) {if (err) return console.log(err);});
		var d1 = new Date();
			var stopTime = d1.getTime();
			var elapsedTime = stopTime - startTime;
			console.log('completed in '+elapsedTime);
		//process.exit(0);
		
	});
	
});
function substringExists(str1,str2)
{
	if( str1.indexOf(str2)!=-1 )
	return true;
	else
	return false;
}
function keyAndSubstringExists(key,arr1,str1,arr2,str2)
{
	if( ( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key)) && ((str1.indexOf(str2)!=-1) || (str2.indexOf(str1)!=-1)) )
	return true;
	else
	return false;
}

function keyAndSubstringExists_rare(key,arr1,str1,arr2,str2)
{
	if( ( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key)) && ((str1.indexOf(str2)!=-1) || (str2.indexOf(str1)!=-1)) )
	return true;
	else
	return myXOR(arr1.hasOwnProperty(key),arr2.hasOwnProperty(key));
}
function keyExists(key,arr1,arr2)
{
	
}

function keyAndEqualExists(key,arr1,str1,arr2,str2)
{
	if( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key) && str1 && str2 &&(str1==str2) ) 
	return true;
	else
	return false;
}
function myXOR(bool1,bool2)
{
	if ( !bool1 == !bool2)
	return true;
	else
	return false;
}