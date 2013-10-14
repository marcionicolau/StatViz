function makeHistogram(variableName)//nbins
{
    var data = variables[variableName];
    var canvas = d3.select("#svgCanvas");
    
    var min = Array.min(data);
    var max = Array.max(data);
    
    // Should be changeable
    var nBins = 10;
    
    var slice = (max - min)/nBins;
    
    console.log("min=" + min + "; max=" + max +"; slice=" + slice);
    
    var bins = [];
    
    for(var i=0; i<nBins; i++)
    {
        bins[i] = 0;
    }   
    
    for(var i=0; i<data.length; i++)
    { 
        bins[Math.ceil((data[i] - min)/slice)]++;
    }
    
    console.log("histogram: " + bins);
    
    var size = 250;
    
    //draw axes
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 + size/2)
                                    .attr("y2", canvasHeight/2 - size/2)
                                    .attr("stroke", "black");
    
}

Array.max = function( array )
 {
         return Math.max.apply( Math, array );
 }

 Array.min = function( array )
 {
     return Math.min.apply( Math, array );
 }	