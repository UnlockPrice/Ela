var fs = require('fs');
var crawler = require('crawler');
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var mysql      = require('mysql');
var amazon_savespec = require('./amazon_savespec.js');
var amazon_scrap = require('./amazon_scrap.js');
var config = require('../../config/config.js');

var mysql      = require('mysql');
	var pool      =    mysql.createPool({
		connectionLimit : 30, //important
		host     : config.host, 
		user     : config.user, 
		password : config.password,  
		database : config.database,
		multipleStatements:true
	});
var startTime;
var d = new Date();
startTime = d.getTime();
var separateReqPool = {maxSockets: 50};

fs.writeFile('laptops_match.txt', '');
var crawlerObj = new crawler({
	maxConnections:50,
	callback: function(){}
});
var page =1;
var total = 0;
amazon_savespec.initialize();
scrapAmazonLinks("http://www.amazon.in/Laptops/b/ref=sv_pc_2?ie=UTF8&node=1375424031",page);
//scrapAmazonLinks("http://www.amazon.in/s/ref=lp_1375424031_pg_2?rh=n%3A976392031%2Cn%3A%21976393031%2Cn%3A1375424031&page=2&ie=UTF8&qid=1437307006",page);
var productCounter = 0;
var productList =[];

function scrapAmazonLinks(url,page){
	crawlerObj.queue({
		uri: url,
		userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 10.10; labnol;) ctrlq.org',
        callback: function(err, resp, $)
		{
			if(!err)
			{
				var links = [];
				var out ="";
				var count =0;

				if(page ==1)
				{
					$("div#rightContainerATF #mainResults .newaps a").each(function(index,item)
					{
						var link = $(this).attr("href");
						//out = out + link +"\n";
						links.push(link);
						count++;
					});
					total = ($("div#rightContainerATF #center #s-result-info-bar-content table #s-result-count").text()).split(" ")[2];
					
				}
				else
				{
					$("div#rightResultsATF .s-result-list-parent-container .s-result-item").each(function(index,item)
					{
						var link = $(this).find("a.a-link-normal").first().attr("href");
						//out = out + link +"\n";
						links.push(link);
						count++;
					});
				}
				next_link = $("div#bottomBar #pagn #pagnNextLink").attr("href");
				//console.log(count);
				if(links.length>0)
				{
					productList =[];
					for(var i=0;i<links.length;i++)
					{
						amazon_scrap.scrapByCrawler(i,links[i],'laptops',getSpecCallBack);
					}
				}
				
				//fs.appendFile('laptops_match.txt', out, function (err) {if (err) return console.log(err);});
				if(next_link)
					scrapAmazonLinks("http://www.amazon.in"+next_link,page+1);
				else
				{
					
				}
				
	
			}
			else
				console.log(err);
		}
	});
}
function getSpecCallBack(productIndex, obj,category,prod_details){
	console.log('final obj:');
	console.log(obj);
	//productCounter++;
	productList[productIndex]=prod_details;
	amazon_savespec.saveSpecifications(productIndex,obj,category, saveSpecCallBack);
}

function saveSpecCallBack(productIndex, specId,specObj){
	productCounter++;
	//console.log(specId);
	//return;
	
	if(productList[productIndex].ProductId !="" && productList[productIndex].ProductId !=undefined)
	{
	var time = new Date();
	var jsonDate = time.toJSON();
		var specIdStr = specId;
		console.log('specStr'+specIdStr);
		//console.log('totalSpecsId:'+productSpecId);
		var specObjStr = JSON.stringify(specObj); 
		
		
		var sql = 'insert into `sepp_product_amazon` (`product_identifier`,`spec_id`,`prime_id`,`product_brand`,`title`,`inStock`,`manufacturer_id`,`shipping`,`mrp`,`selling_price`,`date_added`,`date_modified`,`viewed`,`emi_available`,`cod_available`,`image`,`discount_percentage`,`product_url`) values ('+mysql.escape(productList[productIndex].ProductId)+','+mysql.escape(specObjStr)+','+specId+','+mysql.escape(1)+','+mysql.escape(productList[productIndex].Title)+',1,1,1,'+mysql.escape(productList[productIndex].MRP)+','+mysql.escape(productList[productIndex].Price)+','+mysql.escape(jsonDate)+','+mysql.escape(jsonDate)+','+1+','+1+','+1+','+1+','+mysql.escape(1)+','+mysql.escape(productList[productIndex].URL)+')';
		//console.log(sql);
		pool.query(sql, function(err, rows, fields) 
		{
			if (err) console.log(err);
			console.log('inserted:'+productIndex);
		});
		if(productCounter >= total){
					var d = new Date();
					var stopTime = d.getTime();
					var elapsedTime = stopTime - startTime;
					console.log('completed in '+elapsedTime);
		}
	}
	//}
}


