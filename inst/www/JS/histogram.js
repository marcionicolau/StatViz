function makeHistogram()//nbins
{    
    var data = [];
    var mins = [];
    var maxs = [];
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        data[i] = variables[currentVariableSelection[i]];      
        mins[i] = MIN[currentVariableSelection[i]];      
        maxs[i] = MAX[currentVariableSelection[i]];      
    }
    

    var min = Array.min(mins);
    var max = Array.max(maxs);

    
    // Should be changeable
    var nBins = 15;   
    var size = 500;
    var nGroovesX = 15;
    
    
//     console.log("data:{" + data +"}, \nmin: " + min + ", \nmax: " + max + "\n\n");
     
    var slice = (max - min)/nBins;    
    
    var bins = new Object();
    
    var canvas = d3.select("#svgCanvas");
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        bins[currentVariableSelection[i]] = new Array();
        for(var j=0; j<nBins; j++)
        {
            bins[currentVariableSelection[i]][j] = 0;
        }  
    }
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        for(var j=0; j<data[i].length; j++)
        { 
//             console.log(Math.ceil((data[i][j] - min)/slice) + ", data=" + data[i][j]);
            
            var index = Math.ceil((data[i][j] - min)/slice);
            
            if(index >= nBins)
                index = nBins - 1;
                
            bins[currentVariableSelection[i]][index]++;
        }
    }
    
    console.dir(bins);
    var binMaxs = new Array();
    var binMins = new Array();
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        binMaxs[i] = Array.max(bins[currentVariableSelection[i]]);
        binMins[i] = Array.min(bins[currentVariableSelection[i]]);
    }
            
    var nGroovesY = Array.max(binMaxs) > 10 ? 10 : Array.max(binMaxs)+1;
    console.log(nGroovesY);
    
    var binSlice = (Array.max(binMaxs) - Array.min(binMins))/nGroovesY;
    
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
                    .attr("x", canvasWidth/2 - size/2 + i*xStep - 25)
                    .attr("y", canvasHeight/2 + size/2 + 30)                    
                    .text(format(min + i*slice))
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
                    .text(Math.round(Array.max(binMins) + i*binSlice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    //bars
    for(i=0; i<currentVariableSelection.length; i++)
    {
        for(j=0; j<nBins; j++)
        {
            canvas.append("rect")
                        .attr("x", canvasWidth/2 - size/2 + j*xStep)
                        .attr("y", canvasHeight/2 + size/2 - (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                        .attr("height", (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                        .attr("width", size/nBins)
                        .attr("stroke", "black")
                        .attr("fill", "white")
                        .attr("id", "bin" + i + j)
                        .attr("class", "bins");
        }
    }
}