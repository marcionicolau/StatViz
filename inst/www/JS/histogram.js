var left, right, top, bottom, xStep;
function makeHistogram()
{    
    // TODO: Need to constrain the selection to 3 variables
    
    // boundaries
    left = canvasWidth/2 - plotWidth/2;
    right = canvasWidth/2 + plotWidth/2;
    
    top = canvasHeight/2 - plotHeight/2;
    bottom = canvasHeight/2 + plotHeight/2;
    
    var data = [];
    var mins = [];
    var maxs = [];
    
    var combinedData = [];
    
    var altHistogram = false;
    
    var variableList = sort(currentVariableSelection);
    
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];                                  
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altHistogram = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];                            
                        }
                        break;
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];       
    } 
    
    
    // combine the collected data
    for(var i=0; i<data.length; i++)
    {
        for(var j=0; j<data[i].length; j++)
        {
            combinedData.push(data[i][j]);
        }
    } 
        

    // Find minimum and maximum values
    var min = Array.min(mins);
    var max = Array.max(maxs);
    
    var labels;
    var levels = variableList["independent-levels"];
    
    if(altHistogram == true)    
    {
        labels = levels;
    }    
    else    
    {        
        labels = currentVariableSelection;
    }
    
    var ids = getValidIds(labels);
    
    if(combinedData.unique().length < nBins)
    {
        //bar chart        
        var uniqueData = combinedData.unique();
        
        var numberOfGroovesInXAxis = uniqueData.length;
    
        var slice = (max - min)/uniqueData.length;    
    
        var bins = new Object();
        var canvas = d3.select("#svgCanvas");
    
        // Set all bin count to zero
        for(var i=0; i<labels.length; i++)
        {
            bins[labels[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[labels[i]][j] = 0;
            }  
        }
    
        // Update counts
        for(var i=0; i<labels.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= uniqueData.length)
                    index = uniqueData.length - 1;
                
                bins[labels[i]][uniqueData.indexOf(data[i][j])]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<labels.length; i++)
        {
            binMaxs[i] = Array.max(bins[labels[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicks(Array.max(binMaxs));    
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
        // Draw axes
        
        var xAxis = canvas.append("line")
                                        .attr("x1", left)
                                        .attr("y1", bottom + axesOffset)
                                        .attr("x2", right)
                                        .attr("y2", bottom + axesOffset) 
                                        .attr("stroke", "black")
                                        .attr("id", "xAxis")
                                        .attr("class", "axes");
    
        var yAxis = canvas.append("line")
                                        .attr("x1", left - axesOffset)
                                        .attr("y1", top)
                                        .attr("x2", left - axesOffset)
                                        .attr("y2", bottom)
                                        .attr("stroke", "black")
                                        .attr("id", "yAxis")
                                        .attr("class", "axes");

                                    
        xStep = plotWidth/numberOfGroovesInXAxis;
    
        //grooves
        for(i=0; i<=numberOfGroovesInXAxis; i++)
        {
            canvas.append("line")
                        .attr("x1", left + i*xStep)
                        .attr("y1", bottom  + axesOffset)
                        .attr("x2", left + i*xStep)
                        .attr("y2", bottom + 10 + axesOffset)
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooves");
        
            canvas.append("text")
                        .attr("x", left + i*xStep + xStep/2)
                        .attr("y", bottom + tickTextOffsetXAxis + axesOffset)                    
                        .text(uniqueData[i])
                        .attr("text-anchor", "middle")
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooveText");
        }
    
        var yStep = plotHeight/(nGroovesY-1);
    
        for(i=0; i<nGroovesY; i++)
        {
            canvas.append("line")
                        .attr("x1", left - 10 - axesOffset)
                        .attr("y1", bottom - i*yStep)
                        .attr("x2", left - axesOffset)
                        .attr("y2", bottom - i*yStep)
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooves");
        
            canvas.append("text")
                        .attr("x", left - tickTextOffsetYAxis - axesOffset)
                        .attr("y", bottom - i*yStep + yAxisTickTextOffset)                                        
                        .text(Math.round(i*binSlice))
                        .attr("text-anchor", "end")
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooveText");
        }
    
        //bars
        for(i=0; i<labels.length; i++)
        {
            for(j=0; j<uniqueData.length+2; j++)
            {           
                if(bins[labels[i]][j] != 0)
                {
                    canvas.append("line")
                            .attr("x1", left + j*xStep + (plotWidth/uniqueData.length)/2)
                            .attr("y1", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("x2", left + j*xStep + (plotWidth/uniqueData.length)/2 + ((i+1)/labels.length)*plotWidth*0.15)    
                            .attr("y2", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight - ((i+1)/uniqueData.length)*plotHeight*0.35)
                            .attr("display", "none")
                            .attr("stroke", "black")
                            .attr("id", ids[i] + j)
                            .attr("class", "binTextLines");
                    
                    canvas.append("text")
                            .attr("x", left + j*xStep + (plotWidth/uniqueData.length)/2 + ((i+1)/labels.length)*plotWidth*0.15)                        
                            .attr("y", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight + yAxisTickTextOffset - ((i+1)/uniqueData.length)*plotHeight*0.35)
                            .attr("fill", "black")
                            .attr("text-anchor", "start")
                            .attr("font-size", binCountFontSize)
                            .attr("display", "none")
                            .text(bins[labels[i]][j])
                            .attr("id", ids[i] + j)
                            .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", left + j*xStep)
                            .attr("y", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("height", (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("width", plotWidth/uniqueData.length)          
                            .attr("fill", colors[i])         
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
            
                        
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
        for(var i=0; i<labels.length; i++)
        {
            bins[labels[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[labels[i]][j] = 0;
            }  
        }
    
        // Update counts
        for(var i=0; i<labels.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= nBins)
                    index = nBins - 1;
                
                bins[labels[i]][index]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<labels.length; i++)
        {
            binMaxs[i] = Array.max(bins[labels[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicks(Array.max(binMaxs));    
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
        // Draw axes
        
        var xAxis = canvas.append("line")
                                        .attr("x1", left)
                                        .attr("y1", bottom + axesOffset)
                                        .attr("x2", right)
                                        .attr("y2", bottom + axesOffset) 
                                        .attr("stroke", "black")
                                        .attr("id", "xAxis")
                                        .attr("class", "axes");
    
        var yAxis = canvas.append("line")
                                        .attr("x1", left - axesOffset)
                                        .attr("y1", top)
                                        .attr("x2", left - axesOffset)
                                        .attr("y2", bottom)
                                        .attr("stroke", "black")
                                        .attr("id", "yAxis")
                                        .attr("class", "axes");

                                    
        xStep = plotWidth/numberOfGroovesInXAxis;
    
        //grooves
        for(i=0; i<=numberOfGroovesInXAxis; i++)
        {
            canvas.append("line")
                        .attr("x1", left + i*xStep)
                        .attr("y1", bottom  + axesOffset)
                        .attr("x2", left + i*xStep)
                        .attr("y2", bottom + 10 + axesOffset)
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooves");
        
            canvas.append("text")
                        .attr("x", left + i*xStep)
                        .attr("y", bottom + tickTextOffsetXAxis + axesOffset)                    
                        .text(format(min + i*slice))
                        .attr("text-anchor", "middle")
                        .attr("id", "groove" + i)
                        .attr("class", "xAxisGrooveText");
        }
    
        var yStep = plotHeight/(nGroovesY-1);
    
        for(i=0; i<nGroovesY; i++)
        {
            canvas.append("line")
                        .attr("x1", left - 10 - axesOffset)
                        .attr("y1", bottom - i*yStep)
                        .attr("x2", left - axesOffset)
                        .attr("y2", bottom - i*yStep)
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooves");
        
            canvas.append("text")
                        .attr("x", left - tickTextOffsetYAxis - axesOffset)
                        .attr("y", bottom - i*yStep + yAxisTickTextOffset)                                        
                        .text(Math.round(i*binSlice))
                        .attr("text-anchor", "end")
                        .attr("id", "groove" + i)
                        .attr("class", "yAxisGrooveText");
        }
        
        // var curve = canvas.append("path")                            
//                             .attr("fill", "transparent")
//                             .attr("stroke", "red");
//                             
//         var d = "M" + left + " " + bottom + " ";
//         
//         canvas.append("circle")
//                                 .attr("cx", left)
//                                 .attr("cy", bottom)
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
    
        //bars
        for(i=0; i<labels.length; i++)
        {
            for(j=0; j<nBins; j++)
            {           
                if(bins[labels[i]][j] != 0)
                {
                    canvas.append("line")
                            .attr("x1", left + j*xStep + (plotWidth/nBins)/2)
                            .attr("y1", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("x2", left + j*xStep + (plotWidth/nBins)/2 + ((i+1)/labels.length)*plotWidth*0.15)    
                            .attr("y2", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight - ((i+1)/nBins)*plotHeight*0.35)
                            .attr("display", "none")
                            .attr("stroke", "black")
                            .attr("id", ids[i] + j)
                            .attr("class", "binTextLines");
                    
                    canvas.append("text")
                            .attr("x", left + j*xStep + (plotWidth/nBins)/2 + ((i+1)/labels.length)*plotWidth*0.15)                        
                            .attr("y", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight + yAxisTickTextOffset - ((i+1)/nBins)*plotHeight*0.35)
                            .attr("fill", "black")
                            .attr("text-anchor", "start")
                            .attr("font-size", binCountFontSize)
                            .attr("display", "none")
                            .text(bins[labels[i]][j])
                            .attr("id", ids[i] + j)
                            .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", left + j*xStep)
                            .attr("y", bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("height", (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight)
                            .attr("width", plotWidth/nBins)          
                            .attr("fill", colors[i])         
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
                
                // if(i == 0 && j == 0)
//                 {
// //                     d = d + "C" + getBinCenterX(j) + " " + (bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight) + ", " + getBinCenterX(j+1) + " " + (bottom - (bins[labels[i]][j+1]/Array.max(binMaxs))*plotHeight) + ", " + getBinCenterX(j+2) + " " + (bottom - (bins[labels[i]][j+2]/Array.max(binMaxs))*plotHeight) + " ";                    
//                     d = d + "Q" + getBinCenterX(j) + " " + (bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight) + ", " + getBinCenterX(j+1) + " " + (bottom - (bins[labels[i]][j+1]/Array.max(binMaxs))*plotHeight) + " ";                    
//                     
//                     canvas.append("circle")
//                                 .attr("cx", getBinCenterX(j))
//                                 .attr("cy", (bottom - (bins[labels[i]][j]/Array.max(binMaxs))*plotHeight))
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
//                     
//                     canvas.append("circle")
//                                 .attr("cx", getBinCenterX(j+1))
//                                 .attr("cy", (bottom - (bins[labels[i]][j+1]/Array.max(binMaxs))*plotHeight))
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
//                     
//                     canvas.append("circle")
//                                 .attr("cx", getBinCenterX(j+2))
//                                 .attr("cy", (bottom - (bins[labels[i]][j+2]/Array.max(binMaxs))*plotHeight))
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
//                     
//                 }
//                 else if(j%2 == 1)
//                 {
// //                     d = d + "S" + getBinCenterX(j+2) + " " + (bottom - (bins[labels[i]][j+2]/Array.max(binMaxs))*plotHeight) + ", " + getBinCenterX(j+3) + " " + (bottom - (bins[labels[i]][j+3]/Array.max(binMaxs))*plotHeight) + " ";
//                        d = d + "T" + getBinCenterX(j+1) + " " + (bottom - (bins[labels[i]][j+1]/Array.max(binMaxs))*plotHeight) + " ";
//                     
//                     canvas.append("circle")
//                                 .attr("cx", getBinCenterX(j+2))
//                                 .attr("cy", (bottom - (bins[labels[i]][j+2]/Array.max(binMaxs))*plotHeight))
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
//                     
//                     canvas.append("circle")
//                                 .attr("cx", getBinCenterX(j+3))
//                                 .attr("cy", (bottom - (bins[labels[i]][j+3]/Array.max(binMaxs))*plotHeight))
//                                 .attr("r", "5px")
//                                 .attr("fill", "darkgoldenrod");
//                 }
                        
            }
        }
//         curve.attr("d", d + "Z");        
        
        
    }
}

function makeHistogramWithDensityCurve(left, top, histWidth, histHeight, dependentVariable, level)
{
    var right = left + histWidth;
    var bottom = top + histHeight;
    
    var data = variables[dependentVariable][level];
    var min = MIN[dependentVariable][level];
    var max = MAX[dependentVariable][level];
    
    var shortAxesOffset = axesOffset*(histWidth/plotWidth);
    
    var id = level;       
       
    var numberOfGroovesInXAxis = nBins;    
    
    var slice = (max - min)/nBins;    

    var bins = [];
    var canvas = d3.select("#svgCanvas"); //this should be changed
    
    canvas.append("rect")
            .attr("x", left)
            .attr("y", top)
            .attr("width", histWidth)
            .attr("height", histHeight)
            .attr("fill", "none")
            .attr("stroke", "purple");
            

    // Set all bin count to zero
    for(var i=0; i<nBins; i++)
    {
        bins[i] = 0;
    }  

    // Binning
    for(var i=0; i<nBins; i++)
    {
        var index = Math.ceil((data[i] - min)/slice);
        
        if(index >= nBins)
            index = nBins - 1;
        
        bins[index]++;                 
    }

    var maxBinSize = Array.max(bins);
    
    // Find ticks   
    var nGroovesY = findTicks(maxBinSize);    
    var binSlice = maxBinSize/(nGroovesY-1);

    // Draw axes
    
    var xAxis = canvas.append("line")
                                    .attr("x1", left)
                                    .attr("y1", bottom + shortAxesOffset)
                                    .attr("x2", right)
                                    .attr("y2", bottom + shortAxesOffset) 
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");

    var yAxis = canvas.append("line")
                                    .attr("x1", left - shortAxesOffset)
                                    .attr("y1", top)
                                    .attr("x2", left - shortAxesOffset)
                                    .attr("y2", bottom)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");

                                
    xStep = histWidth/numberOfGroovesInXAxis;

    //grooves
    for(i=0; i<=numberOfGroovesInXAxis; i++)
    {
        canvas.append("line")
                    .attr("x1", left + i*xStep)
                    .attr("y1", bottom  + shortAxesOffset)
                    .attr("x2", left + i*xStep)
                    .attr("y2", bottom + 10 + shortAxesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
    
        canvas.append("text")
                    .attr("x", left + i*xStep)
                    .attr("y", bottom + tickTextOffsetXAxis + shortAxesOffset)                    
                    .text(format(min + i*slice))
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }

    var yStep = histHeight/(nGroovesY-1);

    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", left - 10 - shortAxesOffset)
                    .attr("y1", bottom - i*yStep)
                    .attr("x2", left - shortAxesOffset)
                    .attr("y2", bottom - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
    
        canvas.append("text")
                    .attr("x", left - tickTextOffsetYAxis - shortAxesOffset)
                    .attr("y", bottom - i*yStep + yAxisTickTextOffset)                                        
                    .text(Math.round(i*binSlice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }

    //bins
    for(i=0; i<nBins; i++)
    {
        canvas.append("rect")
                    .attr("x", left + j*xStep)
                    .attr("y", bottom - (bins[i]/Array.max(maxBinSize))*histHeight)
                    .attr("height", (bins[labels[i]][j]/Array.max(maxBinSize))*histHeight)
                    .attr("width", histWidth/nBins)          
                    .attr("fill", meanColors["normal"])         
                    .attr("id", id + i)
                    .attr("class", "bins");
    }   
}

function getBinCenterX(j)
{
    return left + j*xStep + xStep/2;
}
