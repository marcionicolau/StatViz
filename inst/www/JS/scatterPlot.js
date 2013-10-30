
var mins = [];
var maxs = [];
   
   
function makeScatterplot()
{   
    //boundaries    
    var left = canvasWidth/2 - plotWidth/2;
    var right = canvasWidth/2 + plotWidth/2;
    
    var top = canvasHeight/2 - plotHeight/2;
    var bottom = canvasHeight/2 + plotHeight/2;
    
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
                                    
    
    //grooves
    
    //todo: x-axis grooves
    
    //y-axis grooves
    var xStep = plotWidth/(numberOfGrooves-1);
    var yStep = plotHeight/(numberOfGrooves-1);
    var xSlice = (maxs[0] - mins[0])/(numberOfGrooves-1);    
    var ySlice = (maxs[1] - mins[1])/(numberOfGrooves-1);    
    
    //grooves
    for(i=0; i<numberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", left + i*xStep)
                    .attr("y1", bottom + axesOffset)
                    .attr("x2", left + i*xStep)
                    .attr("y2", bottom + 10 + axesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", left + i*xStep)
                    .attr("y", bottom + tickTextOffsetXAxis + axesOffset)                    
                    .text(format(mins[0] + i*xSlice))
                    .attr("font-size", fontSize + "px")
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<numberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", left - 10 - axesOffset)
                    .attr("y1", bottom - i*yStep)
                    .attr("x2", left  - axesOffset)
                    .attr("y2", bottom - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", left - tickTextOffsetYAxis - axesOffset)
                    .attr("y", bottom - i*yStep + yAxisTickTextOffset)                    
                    .text(format(mins[1] + i*ySlice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<data[0].length; i++)
    {
        var color = currentVariableSelection.length > 2 ? colorsForPlot[data[2]] : "black";        
        canvas.append("circle")
                    .attr("cx", left + getValue1(data[0][i], 0)*plotWidth)
                    .attr("cy", bottom - getValue1(data[1][i], 1)*plotHeight)
                    .attr("r", datapointRadius)
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function getValue1(number, type)
{
    return (number - mins[type])/(maxs[type] - mins[type]);
}