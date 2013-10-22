function makeHistogram()
{    
    // TODO: Need to constrain the selection to 3 variables
    
    var data = [];
    var mins = [];
    var maxs = [];
    
    var combinedData = [];
    
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        data[i] = variables[currentVariableSelection[i]];      
        mins[i] = MIN[currentVariableSelection[i]];      
        maxs[i] = MAX[currentVariableSelection[i]];
        
        for(var j=0; j<data[i].length; j++)
        {
            combinedData.push(data[i][j]);
        }      
    }
    
    console.log("combined data=[" + combinedData + "]");

    // Find minimum and maximum values
    var min = Array.min(mins);
    var max = Array.max(maxs);
    
    console.log("unique data: " + combinedData.unique());
    
    if(combinedData.unique().length < nBins)
    {
        //bar chart        
        var uniqueData = combinedData.unique();
        
        var numberOfGroovesInXAxis = uniqueData.length + 2;
    
        var slice = (max - min)/uniqueData.length;    
    
        var bins = new Object();
        var canvas = d3.select("#svgCanvas");
    
        // Set all bin count to zero
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            bins[currentVariableSelection[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[currentVariableSelection[i]][j] = 0;
            }  
        }
    
        // Update counts
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= uniqueData.length)
                    index = uniqueData.length - 1;
                
                bins[currentVariableSelection[i]][index]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            binMaxs[i] = Array.max(bins[currentVariableSelection[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicks(Array.max(binMaxs));    
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
        // Draw axes
        
        var xAxis = canvas.append("line")
                                        .attr("x1", canvasWidth/2 - size/2)
                                        .attr("y1", canvasHeight/2 + size/2 + axesOffset)
                                        .attr("x2", canvasWidth/2 + size/2)
                                        .attr("y2", canvasHeight/2 + size/2 + axesOffset) 
                                        .attr("stroke", "black")
                                        .attr("id", "xAxis")
                                        .attr("class", "axes");
    
        var yAxis = canvas.append("line")
                                        .attr("x1", canvasWidth/2 - size/2 - axesOffset)
                                        .attr("y1", canvasHeight/2 - size/2)
                                        .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                                        .attr("y2", canvasHeight/2 + size/2)
                                        .attr("stroke", "black")
                                        .attr("id", "yAxis")
                                        .attr("class", "axes");

                                    
        var xStep = size/numberOfGroovesInXAxis;
    
        //grooves
        for(i=0; i<=numberOfGroovesInXAxis; i++)
        {
            canvas.append("line")
                        .attr("x1", canvasWidth/2 - size/2 + i*xStep)
                        .attr("y1", canvasHeight/2 + size/2  + axesOffset)
                        .attr("x2", canvasWidth/2 - size/2 + i*xStep)
                        .attr("y2", canvasHeight/2 + size/2 + 10 + axesOffset)
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooves");
        
            canvas.append("text")
                        .attr("x", canvasWidth/2 - size/2 + i*xStep - 15)
                        .attr("y", canvasHeight/2 + size/2 + 30 + axesOffset)                    
                        .text(format(min + i*slice))
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooveText");
        }
    
        var yStep = size/(nGroovesY-1);
    
        for(i=0; i<nGroovesY; i++)
        {
            canvas.append("line")
                        .attr("x1", canvasWidth/2 - size/2 - 10 - axesOffset)
                        .attr("y1", canvasHeight/2 + size/2 - i*yStep)
                        .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                        .attr("y2", canvasHeight/2 + size/2 - i*yStep)
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooves");
        
            canvas.append("text")
                        .attr("x", canvasWidth/2 - size/2 - 35 - axesOffset)
                        .attr("y", canvasHeight/2 + size/2 - i*yStep + 10)                                        
                        .text(Math.round(i*binSlice))
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooveText");
        }
    
        //bars
        for(i=0; i<currentVariableSelection.length; i++)
        {
            for(j=0; j<uniqueData.length+2; j++)
            {           
                if(bins[currentVariableSelection[i]][j] != 0)
                {
                    canvas.append("text")
                                .attr("x", canvasWidth/2 - size/2 + j*xStep + (size/uniqueData.length)/2)                        
                                .attr("y", canvasHeight/2 + size/2 - (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size + 15)
                                .attr("fill", "black")
                                .attr("text-anchor", "middle")
                                .attr("font-size", binCountFontSize)
                                .attr("display", "none")
                                .text(bins[currentVariableSelection[i]][j])
                                .attr("id", currentVariableSelection[i] + j)
                                .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", canvasWidth/2 - size/2 + j*xStep)
                            .attr("y", canvasHeight/2 + size/2 - (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                            .attr("height", (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                            .attr("width", size/uniqueData.length)          
                            .attr("fill", colors[i])         
                            .attr("id", currentVariableSelection[i] + j)
                            .attr("class", "bins");
            
                        
            }
        }
    }
    }
    else
    {
        // Should be changeable
        var numberOfGroovesInXAxis = 10;
    
        var slice = (max - min)/nBins;    
    
        var bins = new Object();
        var canvas = d3.select("#svgCanvas");
    
        // Set all bin count to zero
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            bins[currentVariableSelection[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[currentVariableSelection[i]][j] = 0;
            }  
        }
    
        // Update counts
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= nBins)
                    index = nBins - 1;
                
                bins[currentVariableSelection[i]][index]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<currentVariableSelection.length; i++)
        {
            binMaxs[i] = Array.max(bins[currentVariableSelection[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicks(Array.max(binMaxs));    
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
        // Draw axes
        
        var xAxis = canvas.append("line")
                                        .attr("x1", canvasWidth/2 - size/2)
                                        .attr("y1", canvasHeight/2 + size/2 + axesOffset)
                                        .attr("x2", canvasWidth/2 + size/2)
                                        .attr("y2", canvasHeight/2 + size/2 + axesOffset) 
                                        .attr("stroke", "black")
                                        .attr("id", "xAxis")
                                        .attr("class", "axes");
    
        var yAxis = canvas.append("line")
                                        .attr("x1", canvasWidth/2 - size/2 - axesOffset)
                                        .attr("y1", canvasHeight/2 - size/2)
                                        .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                                        .attr("y2", canvasHeight/2 + size/2)
                                        .attr("stroke", "black")
                                        .attr("id", "yAxis")
                                        .attr("class", "axes");

                                    
        var xStep = size/numberOfGroovesInXAxis;
    
        //grooves
        for(i=0; i<=numberOfGroovesInXAxis; i++)
        {
            canvas.append("line")
                        .attr("x1", canvasWidth/2 - size/2 + i*xStep)
                        .attr("y1", canvasHeight/2 + size/2  + axesOffset)
                        .attr("x2", canvasWidth/2 - size/2 + i*xStep)
                        .attr("y2", canvasHeight/2 + size/2 + 10 + axesOffset)
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooves");
        
            canvas.append("text")
                        .attr("x", canvasWidth/2 - size/2 + i*xStep - 15)
                        .attr("y", canvasHeight/2 + size/2 + 30 + axesOffset)                    
                        .text(format(min + i*slice))
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooveText");
        }
    
        var yStep = size/(nGroovesY-1);
    
        for(i=0; i<nGroovesY; i++)
        {
            canvas.append("line")
                        .attr("x1", canvasWidth/2 - size/2 - 10 - axesOffset)
                        .attr("y1", canvasHeight/2 + size/2 - i*yStep)
                        .attr("x2", canvasWidth/2 - size/2 - axesOffset)
                        .attr("y2", canvasHeight/2 + size/2 - i*yStep)
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooves");
        
            canvas.append("text")
                        .attr("x", canvasWidth/2 - size/2 - 35 - axesOffset)
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
                if(bins[currentVariableSelection[i]][j] != 0)
                {
                    canvas.append("text")
                                .attr("x", canvasWidth/2 - size/2 + j*xStep + (size/nBins)/2)                        
                                .attr("y", canvasHeight/2 + size/2 - (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size + 15)
                                .attr("fill", "black")
                                .attr("text-anchor", "middle")
                                .attr("font-size", binCountFontSize)
                                .attr("display", "none")
                                .text(bins[currentVariableSelection[i]][j])
                                .attr("id", currentVariableSelection[i] + j)
                                .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", canvasWidth/2 - size/2 + j*xStep)
                            .attr("y", canvasHeight/2 + size/2 - (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                            .attr("height", (bins[currentVariableSelection[i]][j]/Array.max(binMaxs))*size)
                            .attr("width", size/nBins)          
                            .attr("fill", colors[i])         
                            .attr("id", currentVariableSelection[i] + j)
                            .attr("class", "bins");
            
                        
            }
        }
    }
}