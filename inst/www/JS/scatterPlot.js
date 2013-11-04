
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
    
    var colorData;
    var uniqueColorData;
    
    var colorsForPlot = new Object();
    
    if(currentVariableSelection.length == 3)
    {
        colorData = variables[currentVariableSelection[2]]["dataset"];
        uniqueColorData = colorData.unique();
        
        for(var i=0; i<uniqueColorData.length; i++)
        {
            colorsForPlot[uniqueColorData[i]] = colors[i];
        }
    }
    
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
    
    var uniqueDataX = data[0].unique();
    var uniqueDataY = data[1].unique();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > numberOfGrooves ? numberOfGrooves : uniqueDataX.length;
    var numberOfGroovesInYAxis = uniqueDataY.length > numberOfGrooves ? numberOfGrooves : uniqueDataY.length;
    
    //y-axis grooves
    var xStep = uniqueDataX.length <= numberOfGrooves ? plotWidth/numberOfGroovesInXAxis : plotWidth/(numberOfGroovesInXAxis - 1);
    var yStep = uniqueDataY.length <= numberOfGrooves ? plotHeight/numberOfGroovesInYAxis : plotHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxs[0] - mins[0])/(numberOfGroovesInXAxis - 1);    
    var ySlice = (maxs[1] - mins[1])/(numberOfGroovesInYAxis - 1);    
    
    var axisText, textPosition;
    //grooves
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = format(mins[0] + i*xSlice);
        textPosition = LEFT + i*xStep;
        
        if(uniqueDataX.length <= numberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = LEFT + xStep/2 + i*xStep;
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
        
        if(uniqueDataY.length <= numberOfGrooves)
        {
            axisText = uniqueDataY[i];
            console.log(uniqueDataY[i]);
            textPosition = BOTTOM - yStep/2 - i*yStep;                    
        }
        
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
    
    for(var i=0; i<data[0].length; i++)
    {
        var x,y;
        
        if(uniqueDataX.length <= numberOfGrooves)
            x = LEFT + uniqueDataX.indexOf(data[0][i])*xStep + xStep/2;    
        else
            x = LEFT + getValue1(data[0][i], 0)*plotWidth;
            
        if(uniqueDataY.length <= numberOfGrooves)
            y = BOTTOM - uniqueDataY.indexOf(data[1][i])*yStep - yStep/2;
        else
            y = BOTTOM - getValue1(data[1][i], 1)*plotHeight;
        
        
        var color = currentVariableSelection.length > 2 ? colorsForPlot[colorData[i]] : "black";        
        
        canvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
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