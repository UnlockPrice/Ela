var strand = require('strand');

exports.decodeRules= function(arr1,arr2,rules)
{
	var resultStack = [];
	var tmp = rules.split(" ");
	
	for(var i=0;i<tmp.length;i++)
	{
		if (tmp[i]==")")
		{
			/*
				var oprnd1 = resultStack.pop();
				var opr = resultStack.pop();
				var oprnd2 = resultStack.pop();
				var br = resultStack.pop();
				var result = function_calculate(arr1,oprnd1,opr,arr2,oprnd2);
				resultStack.push(result);
			*/
			do
			{
				var oprnd1 = resultStack.pop();
				var opr = resultStack.pop();
				var oprnd2 = resultStack.pop();
				var br = resultStack.pop();
				if(br != "(" )
				resultStack.push(br);
				var result = function_calculate(arr1,oprnd1,opr,arr2,oprnd2);
				resultStack.push(result);
			}
			while( br != "(" )
		}
		else
		{
			if(tmp[i])
			resultStack.push(tmp[i]);
		}
		
		
	}
	if (resultStack.length != 1)
	return "Error";
	else
	return resultStack.pop();
}

function function_calculate(arr1,key1,opr,arr2,key2)
{
	if (opr == "EQ")
		return keyAndEqualExists(arr1,key1,arr2,key2);
	else if(opr == "SU")
		return keyAndSubstringExists(arr1,key1,arr2,key2);
	else if(opr == "SUR")
		return keyAndSubstringExists_rare(arr1,key1,arr2,key2);
	else if(opr == "SS")
		return keyAndSubsequenceExists(arr1,key1,arr2,key2);
	else if(opr == "ASE")
		return keyAndArraySubsetEqualExists(arr1,key1,arr2,key2);
	else if(opr == "AND")
		return (key1 && key2);
	else if(opr == "OR")
		return (key1 || key2);
	
}

var arraySubset = function (arr1, arr2) {
    return arr2.some(function (v) {
        return arr1.indexOf(v) >= 0;
	});
};


function keyAndArraySubsetEqualExists(arr1,key1,arr2,key2)
{
	if(  arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2) && arr1[key1] && arr2[key2] )
	{
		var regexp = new RegExp('[-+()*/.:? ]', 'g');
		//var tmp1 = arr1[key1].replace(/(\(.*?\))/g, '').split("/");
		//var tmp2 = arr2[key2].replace(/(\(.*?\))/g, '').split("/");
		var tmparr1 = arr1[key1].split(regexp);
		var tmparr2 = arr2[key2].split(regexp);
		if( arraySubset(tmparr1,tmparr2) )
		return true;
		else
		return false;
	}
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}

function substringExists(str1,str2)
{
	if( str1.indexOf(str2)!=-1 )
	return true;
	else
	return false;
}
function keyAndSubstringExists(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && arr1[key1]!="-1" && arr2[key2]!="-1" && ((arr1[key1].indexOf(arr2[key2])!=-1) || (arr2[key2].indexOf(arr1[key1])!=-1)) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function keyAndSubsequenceExists(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && mySubsequence(arr1[key1],arr2[key2]) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function mySubsequence(str1,str2)
{
	if(strand.subSequence(str1,str2).sequence==str1 || strand.subSequence(str1,str2).sequence ==str2 )
	return true;
	else
	return false;
}

function keyAndSubstringExists_rare(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && ((arr1[key1].indexOf(arr2[key2])!=-1) || (arr2[key2].indexOf(arr1[key1])!=-1)) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}

function keyAndEqualExists(arr1,key1,arr2,key2)
{
	if( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2) && arr1[key1] && arr2[key2] && arr1[key1]!="-1" && arr2[key2]!="-1" && (arr1[key1]==arr2[key2]) ) 
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function rulesExceptions(arr1,key1,arr2,key2)
{
	//if ( !bool1 == !bool2)
	if( arr1.hasOwnProperty(key1)==false && arr2.hasOwnProperty(key2)==false )
		return true;
	else if ( ( arr1.hasOwnProperty(key1)==false && arr2.hasOwnProperty(key2) && arr2[key2]=="-1" ) || ( arr2.hasOwnProperty(key2)==false && arr1.hasOwnProperty(key1) && arr1[key1]=="-1" ))
		return true;
	else if ( ( arr1.hasOwnProperty(key1) && arr1[key1]=="no" && arr2.hasOwnProperty(key2) && arr2[key2]=="-1" ) || ( arr2.hasOwnProperty(key2) && arr2[key2]=="no" && arr1.hasOwnProperty(key1) && arr1[key1]=="-1" ) )
		return true;
	else
		return false;
}