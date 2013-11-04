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
    
    console.log("total=" + values.length);
    
    var half1 = new Array();
    var half2 = new Array();
    if(values.length % 2)
    {
        //odd
        for(var i=0; i<(values.length)/2; i++)
            half1.push(values[i]);
            
        for(var i=((values.length)/2)+1; i<values.length; i++)
        {   
            console.log(values[i]);
            half2.push(values[i]);
        }
    }
    else
    {
        //even
        for(var i=0; i<(values.length)/2; i++)
            half1.push(values[i]);
            
        for(var i=values.length/2; i<values.length; i++)
            half2.push(values[i]);
    }
    
    console.log("half1=[" + half1 + "]");
    console.log("1st length= " + half1.length);
    console.log("half2=[" + half2 + "]");
    console.log("2nd length= " + half2.length);
    
    var q1, q3;
    q1 = median(half1);
    q3 = median(half2);
    
    return q3 - q1;
}   