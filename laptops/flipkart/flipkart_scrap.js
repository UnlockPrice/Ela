var crawler = require('crawler');
var scrapobj = require('./flipkart_scrapobj.js').obj;
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var mysql      = require('mysql');


var respPending=0;
var productSpecId=0;
var count = 1;
var separateReqPool = {maxSockets: 50};

var finalobj = {};
var crawlerObj = new crawler({
	maxConnections:30,
	callback: function(){}
});

exports.scrapByCrawler=function(productIndex,url,category, callback){
	
	for(var key in scrapobj[category])
	finalobj[scrapobj[category][key]]='-1';
	//console.log('getSpecifications');
	crawlerObj.queue({
		uri: url,
		userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 10.10; labnol;) ctrlq.org',
        callback: function(err, resp, $){
			if(!err)
			{
				var obj = {};
				$(".specTable tr").each(function(){
					if($(this).children().length>1){
						var key = $(this).children(".specsKey").text().replace(/\s/g, '').toLowerCase();
						var value = $(this).children(".specsValue").text().replace(/\s/g, '').toLowerCase();
						var customobj = customParser(category,key,value);
						for(var i=0;i<customobj.length;i++){
							if(scrapobj[category].hasOwnProperty(customobj[i].key) && !obj.hasOwnProperty(scrapobj[category][customobj[i].key])){
								obj[scrapobj[category][customobj[i].key]]=customobj[i].value;
							}
						}
					}
				});
				
				finalobj={}
				for(var key in scrapobj[category]){
					if(obj.hasOwnProperty(scrapobj[category][key])){
						finalobj[scrapobj[category][key]]=obj[scrapobj[category][key]];
					}
				}
				finalobj = changeObjectFinal(category,finalobj);
				//console.log(obj);
				//console.log('scraped:'+productIndex);
				callback(productIndex, finalobj,category);
				return; 
			}
			else //error handling
			{
				console.log('error:'+productIndex);
				callback(productIndex, -1,category);
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

function getSpecIdCallBack(specId){
	console.log('totalSpecsId:'+specId);
}

function customParser(category,key,value){
	var returnObj=[], obj={};
	if(category=='televisions'){
		switch(key){
			case 'hdtechnology&resolution':
			var keyArr = key.split('&');
			var valueArr = value.split(',');
			for(var i =0;i<keyArr.length;i++){
				if(valueArr[i]!=''){
					obj={};
					obj['key']=keyArr[i];
					obj['value']=valueArr[i];
					returnObj.push(obj);
				}
			}
			break;
			case 'displaysize':
			var matches = value.split('(');
			if(matches.length<=2){
				var keyArr=['displaysize(cm)','displaysize(inch)'];
				for(var i =0;i<keyArr.length;i++){
					if(matches[i]!=''){
						var endIndex = matches[i].indexOf(')');
						if(endIndex>-1){
							matches[i] = matches[i].slice(0,endIndex);
						}
						obj={};
						obj['key']=keyArr[i];
						obj['value']=matches[i];
						returnObj.push(obj);
					}
				}
			}
			break;
			default:
			obj['key']=key;
			obj['value']=value;
			returnObj[0]=obj;
			break;
		}
		return returnObj;
	}
	obj['key']=key;
	obj['value']=value;
	returnObj.push(obj);
	return returnObj;
}