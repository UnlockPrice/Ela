
var crawler = require('crawler');
var scrapobj = require('./amazon_scrapobj.js').obj;
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var mysql      = require('mysql');

var respPending=0;
var productSpecId=0;


var count = 1;
var separateReqPool = {maxSockets: 50};

var finalObj = {};

var crawlerObj = new crawler({
	maxConnections:50,
	callback: function(){}
});
//console.log(scrapobj.laptops);
var productdetails ={};

exports.scrapByCrawler=function(productIndex,url,category, callback){
	//console.log('getSpecifications Test');
	crawlerObj.queue({
		uri: url,
		userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 10.10; labnol;) ctrlq.org',
        callback: function(err, resp, $){
			if(!err)
			{
				//var url = $("#og-url").attr("content");							
				//console.log(url);
				if(url)
				{
					productdetails ={};
					var temp = url.split("/");
					var productid = temp[5].replace(/\s/g, '');
					//var productid = $("#ASIN").text();
					console.log(url + ":"+productid);
					if(productid)
					{
						var obj = {};
						$("div.pdTab table tr").each(function(index,item)
						{
							var key = $(this).children("td:nth-child(1)").text();	
							key = key.replace(/\s/g, '').toLowerCase();
							
							if(scrapobj[category].hasOwnProperty(key) && !obj.hasOwnProperty(scrapobj[category][key]))
							{
								var value = $(this).children("td:nth-child(2)").text();
								value = value.replace(/\s/g, '').toLowerCase();
								obj[scrapobj[category][key]]=value;	
							}					
						});	
						
						finalobj={};
						for(var key in scrapobj[category])
						{
							if(obj.hasOwnProperty(scrapobj[category][key])){
								finalobj[scrapobj[category][key]]=obj[scrapobj[category][key]];
							}
						}	
						//console.log(ProductDetails);
						
						var saleprice = $("#priceblock_saleprice").text();
						var ourprice = $("#priceblock_ourprice").text();
						
						var price ;
						
						if(saleprice)
						{
							price = saleprice;
						}
						else if(ourprice)
						{
							price = ourprice;
						}
						else
						{
							price =$(".a-color-price").first().text();
						}
						
						var mrp = $('#currencyINR').next().text();
						var emi =$("#inemi_feature_div").clone().children().remove().end().text().trim();
						var stock = $("#availability").clone().children().remove().end().text().trim();
						var cod = $("#saleprice_shippingmessage").clone().children().remove().end().text().trim();
						
						if(!stock)
						{
							stock =$("#availability :first-child").text().trim();
						}
						
						var discount ;
						$('#price table tr').each(function(index,item)
						{
							//console.log('discutn');
							discount = $(this).children("td:nth-child(2)").text().trim();	
						});
						
						//console.log('price:'+ price);
						//console.log('mrp:'+ mrp);
						//console.log('emi:'+ emi);
						//console.log('stock:'+ stock);
						//console.log('cod:'+ cod);
						//console.log('discount:'+ discount);
						var title = $("#productTitle").text();
						
						var productdetails ={'ProductId':productid ,'Title':title,'Price': price , 'MRP': mrp,'Delivery':'No','COD':cod,'EMI':emi,'Offers':$(".ClsOfferText").text(),'Discount':discount,'STOCK':stock,'URL':url};	
						
						finalobj = changeObjectFinal(category,finalobj);
						callback(productIndex,finalobj,category,productdetails);
						return; 
					}
				}
			}
		}
	});
}



function changeObjectFinal(category,obj)
{
	if(category == "laptops")
	{
		if(obj['screentype'])
		{
			if(obj['screentype'].indexOf("touch") != -1)
			obj['screentype'] = "touch";
			else
			obj['screentype'] = "notouch";
		}
	}
	
	return obj;
}
