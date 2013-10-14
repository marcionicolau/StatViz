function makeHistogram(variableName)//nbins
{
    var data = variables[variableName];
    var canvas = d3.select("#svgCanvas");
    
    var min = Array.min(data);
    var max = Array.max(data);
    
    // Should be changeable
    var nBins = 10;   
    var size = 500;
    var nGroovesX = 10;
    
     
    var slice = (max - min)/nBins;    
    
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
    
    
    var nGroovesY = Array.max(bins) > 10 ? 10 : Array.max(bins)+1;
    
    console.log(nGroovesY);
    
    //draw axes
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 + size/2)
                                    .attr("x2", canvasWidth/2 + size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");
                                    
    var xStep = size/nGroovesX;
    
    //grooves
    for(i=0; i<=nGroovesX; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y1", canvasHeight/2 + size/2 - 5)
                    .attr("x2", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y2", canvasHeight/2 + size/2 + 5)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y", canvasHeight/2 + size/2 + 35)                    
                    .text(Math.round(min + i*slice))
                    .attr("id", "groove" + i)
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
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 35)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep + 10)                                        
                    .text(0+i)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    //bars
    for(i=0; i<nBins; i++)
    {
        canvas.append("rect")
                    .attr("x", canvasWidth/2 - size/2 + i*xStep)
                    .attr("y", canvasHeight/2 + size/2 - (bins[i]/Array.max(bins))*size)
                    .attr("height", (bins[i]/Array.max(bins))*size)
                    .attr("width", size/nBins)
                    .attr("stroke", "black")
                    .attr("fill", "white")
                    .attr("id", "bin" + i)
                    .attr("class", "bins");
    }
    
}