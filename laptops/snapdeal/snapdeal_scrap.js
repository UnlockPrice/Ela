// var http = require('http');
// http.globalAgent.maxSockets = 64;
var crawler = require('crawler');
var scrapobj = require('./snapdeal_scrapobj.js').obj;
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var mysql      = require('mysql');

var productdetails_arr = ['ProductId','Price','MRP','Delivery','COD','EMI','Offers','Discount','STOCK','Title','URL'];
exports.productdetails_arr = productdetails_arr;

var respPending=0;
var productSpecId=0;
var count = 1;
var separateReqPool = {maxSockets: 50};

var finalObj = {};

var crawlerObj = new crawler({
	maxConnections:30,
	callback: function(){}
});

exports.scrapByCrawler=function(productIndex,url,category, callback){
	//console.log('getSpecifications');
	var finalobj = {};
	
	var productdetails = {};
	
	for(var ele in productdetails_arr )
	productdetails[productdetails_arr[ele]]='-1';
	
	for(var key in scrapobj[category])
	finalobj[scrapobj[category][key]]='-1';
	
	
	crawlerObj.queue({
		uri: url,
		userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 10.10; labnol;) ctrlq.org',
        callback: function(err, resp, $){
			if(!err)
			{
				var url = $("#og-url").attr("content");	
				productdetails = {};
				if(url)
				{
					var temp = url.split("/");
					var productid = temp[temp.length-1].replace(/\s/g, '');
					console.log(url + ":"+productid);
					if ( productid )
					{
						var obj = {};
						$(".product-spec tr").each(function(index,item)
						{
							var key = $(this).children("td:nth-child(1)").text();
							var value = $(this).children("td:nth-child(2)").text();
							key = key.replace(/\s/g, '').toLowerCase();
							value = value.replace(/\s/g, '').toLowerCase();
							if(scrapobj[category].hasOwnProperty(key) && !obj.hasOwnProperty(scrapobj[category][key]))
							{
								obj[scrapobj[category][key]]=value;
							}	
						});					
						
						for(var key in scrapobj[category]){
							if(obj.hasOwnProperty(scrapobj[category][key])){
								finalobj[scrapobj[category][key]]=obj[scrapobj[category][key]];
							}
						}
						
						var stock = ($(".notifyMe-soldout").text())?"Not Available":"Available";
						
						//productdetails ={productdetails_arr[0]:productid ,productdetails_arr[1]:( ($("#selling-price-id").text())?($("#selling-price-id").text()):'NA' ) ,productdetails_arr[2]: ( ($("#original-price-id").text())?($("#original-price-id").text()):'NA' ),productdetails_arr[3]: ( ($(".standardDeliveryText").text())?($(".standardDeliveryText").text()):'NA' ),productdetails_arr[4]:( ($("#cod-outer-box").text().replace(/\s/g, ''))?($("#cod-outer-box").text().replace(/\s/g, '')):'NA' ),productdetails_arr[5]:( ($("#emi-outer-box").text().replace(/\s/g, ''))?($("#emi-outer-box").text().replace(/\s/g, '')):'NA' ),productdetails_arr[6]:( ($(".ClsOfferText").text())?($(".ClsOfferText").text()):'NA' ),productdetails_arr[7]:( ($("#discount-id").text())?($("#discount-id").text()):'NA' ),productdetails_arr[8]:stock,productdetails_arr[9]:( ($(".pdpName").find("h1").text())?($(".pdpName").find("h1").text()):'NA' ),productdetails_arr[10]:( (url)?(url):'NA' )};	
						productdetails ={"ProductId":productid ,"Price":( ($("#selling-price-id").text())?($("#selling-price-id").text()):'-1' ) ,"MRP": ( ($("#original-price-id").text())?($("#original-price-id").text()):'-1' ),"Delivery": ( ($(".standardDeliveryText").text())?($(".standardDeliveryText").text()):'-1' ),"COD":( ($("#cod-outer-box").text().replace(/\s/g, ''))?($("#cod-outer-box").text().replace(/\s/g, '')):'-1' ),"EMI":( ($("#emi-outer-box").text().replace(/\s/g, ''))?($("#emi-outer-box").text().replace(/\s/g, '')):'-1' ),"Offers":( ($(".ClsOfferText").text())?($(".ClsOfferText").text()):'-1' ),"Discount":( ($("#discount-id").text())?($("#discount-id").text()):'-1' ),"STOCK":stock,"Title":( ($(".pdpName").find("h1").text())?($(".pdpName").find("h1").text()):'-1' ),"URL":( (url)?(url):'-1' )};	
						
						finalobj = changeObjectFinal(category,finalobj);
						callback(productIndex, finalobj,category, productdetails);
						return; 
						
						
					}
					else
					{
						callback(productIndex, finalobj,category, productdetails);
						return; 
					}
				}
				else
				{
					callback(productIndex, finalobj,category, productdetails);
					return; 
				}
			}
			else //error handling
			{
				console.log('error:'+productIndex);
				callback(productIndex, finalobj ,category,productdetails);
				return;
			}
		}
	});
}
function changeObjectFinal(category,finalobj)
{
	if(category == "laptops")
	{
		if(finalobj['hdd'])
		{
			var patt = /ssd|sshd/gi;
			var tmp = finalobj['hdd'].split(/[+?$]|and/gi);
			if(patt.test(tmp[0]))
			{
				finalobj['hdd']='';
				finalobj['ssd']=tmp[0];
			}
			else if(patt.test(tmp[1]))
			{
				finalobj['hdd']=tmp[0];
				finalobj['ssd']=tmp[1];
			}
		}
		if(finalobj['screentype'])
		{
			if(finalobj['screentype'].indexOf("touch") != -1)
			finalobj['screentype'] = "touch";
			else
			finalobj['screentype'] = "notouch";
		}
		if(finalobj['ssd'])
		{
			finalobj['ssd'] = finalobj['ssd'].replace(/Yes,/ig,"");
		}
	}
	
	return finalobj;
}


function UpdateProduct(productdetails)
{
	var titleArr = ["Price","Delivery","COD","EMI","Offers","Discount","STOCK"];	
	
	for(var i=0;i<titleArr.length;i++){
		//key[i]=obj[titleArr[i]]!=undefined?obj[titleArr[i]] : "X";
		if(productObj.hasOwnProperty(titleArr[i])){
			productObj										
			
		}
	}
}

