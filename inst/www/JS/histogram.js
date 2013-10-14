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
    
    bins.length = nBins;
    console.log("histogram: " + bins);
    
    var size = 500;
    var nGroovesX = 10;
    var nGroovesY = Array.max(bins) > 10 ? 10 : Array.max(bins)+1;
    
    console.log(nGroovesY);
    
    //draw axes
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 + size/2)
                                    .attr("x2", canvasWidth/2 + size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black");
    var xStep = size/(nGroovesX-1);
    
    //grooves
    for(i=0; i<=nGroovesX; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y1", canvasHeight/2 + size/2 - 5)
                    .attr("x2", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y2", canvasHeight/2 + size/2 + 5)
                    .attr("stroke", "black")
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y", canvasHeight/2 + size/2 + 25)                    
                    .attr("fill", "black")
                    .text(Math.round(min + i*slice))
                    .attr("class", "xAxisGrooveText");
    }
    
    var yStep = size/(nGroovesY-1);
    
    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 - 5)
                    .attr("y1", canvasHeight/2 + size/2 - i*yStep)
                    .attr("x2", canvasWidth/2 - size/2 + 5)
                    .attr("y2", canvasHeight/2 + size/2 - i*yStep)
                    .attr("stroke", "black")
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 25)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep + 10)                    
                    .attr("fill", "black")
                    .text(0+i)
                    .attr("class", "yAxisGrooveText");
    }
    
    //bars
    for(i=0; i<nBins; i++)
    {
        canvas.append("rect")
                    .attr("x", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y", canvasHeight/2 + size/2 - (bins[i]/Array.max(bins))*size)
                    .attr("height", (bins[i]/Array.max(bins))*size)
                    .attr("width", size/(nBins-1))
                    .attr("stroke", "black")
                    .attr("fill", "white");
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