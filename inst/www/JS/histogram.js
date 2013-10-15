var colors = ["red","rgba(255,0,0,0.5)","rgba(0,255,0,0.5)","rgba(0,0,255,0.5)"];

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
    var nBins = 10;   
    var size = 500;
    var nGroovesX = 10;
    
    
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
    }
        
    var nGroovesY = findTicks(Array.max(binMaxs));
    
    
    console.log("number of ticks in y = " + nGroovesY);
    
    var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
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
                    .attr("x", canvasWidth/2 - size/2 + i*xStep - 15)
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
        
        
        console.log(i*binSlice);
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 35)
                    .attr("y", canvasHeight/2 + size/2 - i*yStep + 10)                                        
                    .text(Math.round(i*binSlice))
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
                        .attr("fill", colors[i])         
                        .attr("id", currentVariableSelection[i])
                        .attr("class", "bins");
        }
    }
}