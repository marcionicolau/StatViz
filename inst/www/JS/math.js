Array.max = function( array )
{
    return Math.max.apply( Math, array );
}

Array.min = function( array )
{
    return Math.min.apply( Math, array );
}	

function mean(values)
{ 
    var total = 0, i;
    for (i = 0; i < values.length; i += 1) {
        total += values[i];
    }
    return total / values.length;
}

function median(values) 
{
    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function isPrime(num) 
{
    if(num < 2) return false;
    for (var i = 2; i < num; i++) {
        if(num%i==0)
            return false;
    }
    return true;
}

function findIQR(values)
{
    values.sort( function(a,b) {return a - b;} );
    
    var half1 = new Array();
    var half2 = new Array();
    if(values.length % 2)
    {
        var x = Math.floor(values.length/2);
        
        //odd
        for(var i=0; i<Math.floor(values.length/2); i++)
            half1.push(values[i]);
            
        for(var i=Math.floor(values.length/2) + 1; i<values.length; i++)
            half2.push(values[i]);
    }
    else
    {
        //even
        for(var i=0; i<Math.floor(values.length/2); i++)
            half1.push(values[i]);
            
        for(var i=Math.floor(values.length/2); i<values.length; i++)
            half2.push(values[i]);
    }
    
    var q1, q3;
    q1 = median(half1);
    q3 = median(half2);
    
    return q3 - q1;
} 

function findCI(variableName, level)
{
    if(level == undefined)
        level = "dataset";
    
    console.log("variable name: " + variableName + ", level= " + level); 
    var distribution = variables[variableName][level];
    
    var SE = getStandardError(distribution);
    var mean = mean(distribution);
    
    CI[variableName][level] = new Array();
    
    CI[variableName][level][0] = mean - 1.96*SE;
    CI[variableName][level][1] = mean + 1.96*SE;
} 

function getStandardError(values)
{   
    var sd = getStandardDeviation(values);
    
    return sd/Math.sqrt(values.length);
}

function getStandardDeviation(values)
{
    var m = mean(values);
    var SS = 0;
    
    for(var i=0; i<values.length; i++)
    {
        SS += Math.pow(values[i] - mean,2);
    }
    
    return Math.sqrt(SS/values.length);
}