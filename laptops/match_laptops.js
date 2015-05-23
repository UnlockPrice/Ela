var	mysql = require('mysql');
var config = require('../config/config.js');

var pool      =    mysql.createPool({
			connectionLimit : 30, //important
		host     : config.host, 
		user     : config.user, 
		password : config.password,  
		database : config.database,
		multipleStatements:true
	});
var sql = "select `product_identifier`, `model_id`, `spec_id`, `prime_id`, `product_brand` from	`sepp_product_flipkart` ";
	pool.query(sql, function(err, result) 
	{
		if (err) console.log(err);
		//console.log(result[0].prime_id);
		var sql1 = "select `product_identifier`,`spec_id`,`prime_id`,`product_brand` from `sepp_product_snapdeal`";
	});