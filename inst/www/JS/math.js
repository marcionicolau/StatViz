Array.max = function( array )
{
    return Math.max.apply( Math, array );
}

Array.min = function( array )
{
    return Math.min.apply( Math, array );
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