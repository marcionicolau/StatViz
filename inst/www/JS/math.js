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
    
    if(half1.length == 0)
        return 0;
    return q3 - q1;
} 

function findCI(distribution)
{
    var SE = getStandardError(distribution);
    var m = mean(distribution);
    
    var array = new Array();
    
    array[0] = m - 1.96*SE;
    array[1] = m + 1.96*SE;
    
    return array;
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
        SS += Math.pow(values[i] - m,2);
    }
    
    return Math.sqrt(SS/values.length);
}
function sumOf(values)
{
    var sum = 0;
    
    for(var i=0; i<values.length; i++)
    {
        sum += values[i];
    }
    
    return sum;
}

function getPearsonCorrelation(X, Y)
{
    var XY = [];
    var XS = [];
    var YS = [];
    
    for(var i=0; i<X.length; i++)
    {
        XY[i] = X[i].Y[i];
        XS[i] = X[i]*X[i];
        YS[i] = Y[i]*Y[i];
    }
    
    var numerator = X.length*sumOf(XY) - sumOf(X)*sumOf(Y);
    var denominator = sqrt((n*sumOf(XS) - sumOf(X)*sumOf(X))*(n*sumOf(YS) - sumOf(Y)*sumOf(Y)));
    var r = numerator/denominator;
    
    return r;
}