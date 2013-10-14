function makeHistogram(variableName)//nbins
{
    var data = variables[variableName];
    
    var canvas = d3.select("#svgCanvas");
    
    var min = Array.min(data);
    var max = Array.max(data);
    
    // Should be changeable
    var bins = 10;
    var slice = (max - min)/bins;
    
    console.log("min=" + min + "; max=" + max +"; slice=" + slice);
    
    for(var i=0; i<data.length; i++)
    {
        console.log((data[i] - min)/slice + "for " + data[i]);
    }
}

Array.max = function( array )
 {
         return Math.max.apply( Math, array );
 }

 Array.min = function( array )
 {
     return Math.min.apply( Math, array );
 }	