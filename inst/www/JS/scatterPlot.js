
var mins = [];
var maxs = [];
   
   
function makeScatterplot()
{   
    //boundaries    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var data = [];    
    
    var colorsForPlot = new Object();
    
    var altScatterPlot = false;
    
    var variableList = sort(currentVariableSelection);
    
    if(currentVariableSelection.length >= 2)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        //dep-dep
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
                        //dep-ind
                        altScatterPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];                        
                        }
                        break;
                    }
            case 2: 
                    {
                        //ind-ind
                        for(var i=0; i<variableList["independent"].length; i++)
                        {
                            data[i] = variables[variableList["independent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["independent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["independent"][i]]["dataset"];                                  
                        }
                        //color plot
                        break;                        
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    
    var labels;
    var levels = variableList["independent-levels"];
    
    if(altScatterPlot == true)    
    {
        labels = levels;
    }    
    else    
    {        
        labels = currentVariableSelection;
    }
    
    var ids = getValidIds(labels);

     
    var canvas = d3.select("#svgCanvas");
    
    // Draw axes
        
    var xAxis = canvas.append("line")
                                    .attr("x1", LEFT)
                                    .attr("y1", BOTTOM + axesOffset)
                                    .attr("x2", RIGHT)
                                    .attr("y2", BOTTOM + axesOffset) 
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", LEFT - axesOffset)
                                    .attr("y1", TOP)
                                    .attr("x2", LEFT - axesOffset)
                                    .attr("y2", BOTTOM)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");
                                    
    
    //grooves
    
    //todo: x-axis grooves
    
    var uniqueDataX = data[0].unique();
    var uniqueDataY = data[1].unique();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > numberOfGrooves ? numberOfGrooves : (uniqueDataX.length + 1);
    var numberOfGroovesInYAxis = uniqueDataY.length > numberOfGrooves ? numberOfGrooves : (uniqueDataY.length + 1);
    
    //y-axis grooves
    var xStep = plotWidth/(numberOfGroovesInXAxis - 1);
    var yStep = plotHeight/(numberOfGroovesInYAxis - 1);
    
    console.log("xStep=" + xStep);
    console.log("nX=" + numberOfGroovesInXAxis);
    console.log("plotWidth = " + plotWidth);
    
    var xSlice = (maxs[0] - mins[0])/(numberOfGroovesInXAxis - 1);    
    var ySlice = (maxs[1] - mins[1])/(numberOfGroovesInYAxis - 1);    
    
    var axisText, textPosition;
    //grooves
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = format(mins[0] + i*xSlice);
        textPosition = LEFT + i*xStep;
        
        if(isNaN(mins[0]))
        {
            axisText = uniqueDataX[i];
            textPosition = LEFT + (i+1)*xStep/2;
        }
        
        canvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", textPosition)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", textPosition)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                    .text(axisText)
                    .attr("font-size", fontSize + "px")
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        axisText = format(mins[1] + i*ySlice);
        textPosition = BOTTOM - i*yStep;                  
        
        if(isNaN(mins[1]))
        {
            axisText = uniqueDataY[i];
            textPosition = BOTTOM - (i+1)*yStep/2;                    
        }
        
        var axisText = isNaN(mins[1]) ? uniqueDataY[i] : format(mins[1] + i*ySlice);
        canvas.append("line")
                    .attr("x1", LEFT - 10 - axesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", LEFT  - axesOffset)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", textPosition + yAxisTickTextOffset)                     
                    .text(axisText)
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    // for(var i=0; i<data[0].length; i++)
//     {
//         var color = currentVariableSelection.length > 2 ? colorsForPlot[data[2]] : "black";        
//         canvas.append("circle")
//                     .attr("cx", LEFT + getValue1(data[0][i], 0)*plotWidth)
//                     .attr("cy", BOTTOM - getValue1(data[1][i], 1)*plotHeight)
//                     .attr("r", datapointRadius)
//                     .attr("fill", color)
//                     .attr("id", "data" + i)
//                     .attr("class", "datapoints");     
//     }
}

function getValue1(number, type)
{
    return (number - mins[type])/(maxs[type] - mins[type]);
}