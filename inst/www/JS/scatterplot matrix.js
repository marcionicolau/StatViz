var minX, maxX, minY, maxY;

// Scatterplot matrix
var shortAxesOffset, shortTickLength, shortDataPointRadius, shortNumberOfGrooves, shortTickTextOffsetXAxis, shortTickTextOffsetYAxis, shortYAxisTickTextOffset, shortFontSize;

function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    
    //any number of dependent variables -> should work
    var numberOfVariables = currentVariableSelection.length;
    
    // Scatterplot matrix
    shortAxesOffset = axesOffset/numberOfVariables;
    shortTickLength = tickLength/numberOfVariables;
    shortDataPointRadius = datapointRadius/numberOfVariables < 1 ? 1 : datapointRadius/numberOfVariables;
    shortNumberOfGrooves = Math.ceil(numberOfGrooves/(numberOfVariables * 1.5)) < 5 ? 5 : Math.ceil(numberOfGrooves/(numberOfVariables * 1.5));
    shortTickTextOffsetXAxis = tickTextOffsetXAxis/(numberOfVariables);
    shortTickTextOffsetYAxis = tickTextOffsetYAxis/(numberOfVariables);
    shortYAxisTickTextOffset = yAxisTickTextOffset/numberOfVariables;
    shortFontSize = fontSize;
    
    if(numberOfVariables > 2)
        shortFontSize = 0;
        
    var canvas = d3.select("#svgCanvas");    
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var TOP = canvasHeight/2 - plotHeight/2;
    
    if(numberOfVariables >= 2)
    {
        // we'll do just this case for now...
        
        for(var i=0; i<numberOfVariables; i++)
        {
            for(var j=0; j<numberOfVariables; j++)
            {
                if(i != j)
                    makeScatterPlotAt(LEFT + j*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis), TOP + i*((plotHeight/numberOfVariables) + shortAxesOffset + shortTickTextOffsetXAxis), (plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis), (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis), variableList["dependent"][j], variableList["dependent"][i]); 
                else
                {
                    canvas.append("text")
                            .attr("x", LEFT + j*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis) + ((plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis))/2)
                            .attr("y", TOP + i*((plotHeight/numberOfVariables) + shortAxesOffset + shortTickTextOffsetXAxis) + ((plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis))/2)
                            .attr("text-anchor", "middle")
                            .attr("fill","crimson")
                            .text(currentVariableSelection[i]);
                }
            }
        }
    }
}

function makeScatterPlotAt(x,y,shortWidth, shortHeight, variableX, variableY, variableColor)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    var canvas = d3.select("#svgCanvas");
    
    y = y + shortHeight;
    
    //may be you can calculate this in makeScatterPlot()
    var maxX = MAX[variableX]["dataset"];
    var minX = MIN[variableX]["dataset"];
    
    var maxY = MAX[variableY]["dataset"];
    var minY = MIN[variableY]["dataset"];
    
    var dataX = variables[variableX]["dataset"];
    var dataY = variables[variableY]["dataset"];
    
    // x-axis
    canvas.append("line")
            .attr("x1", x)
            .attr("y1", y + shortAxesOffset)
            .attr("x2", x + shortWidth)
            .attr("y2", y + shortAxesOffset)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "xAxis");
    
    // y-axis
    canvas.append("line")
            .attr("x1", x - shortAxesOffset)
            .attr("y1", y)
            .attr("x2", x - shortAxesOffset)
            .attr("y2", y - shortHeight)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "yAxis");
    
    var uniqueDataX = dataX.unique();
    var uniqueDataY = dataY.unique();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > shortNumberOfGrooves ? shortNumberOfGrooves : uniqueDataX.length;
    var numberOfGroovesInYAxis = uniqueDataY.length > shortNumberOfGrooves ? shortNumberOfGrooves : uniqueDataY.length;
    
    //y-axis grooves
    var xStep = uniqueDataX.length <= numberOfGrooves ? shortWidth/numberOfGroovesInXAxis : shortWidth/(numberOfGroovesInXAxis - 1);
    var yStep = uniqueDataY.length <= numberOfGrooves ? shortHeight/numberOfGroovesInYAxis : shortHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);    
    
    //grooves
    
    var axisText, textPosition;
    //x-axis ticks
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        axisText = format(minX + i*xSlice);
        textPosition = x + i*xStep;
        
        if(uniqueDataX.length <= numberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = x + xStep/2 + i*xStep;
        }
        
        canvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", y + shortAxesOffset)
                    .attr("x2", textPosition)
                    .attr("y2", y + shortAxesOffset + shortTickLength)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        var textAnchor = "middle";
        if(i == 0)
        {
            textAnchor = "start";
        }
        else if(i == shortNumberOfGrooves-1)
        {
            textAnchor = "end";
        }
        
        canvas.append("text")
                    .attr("x", textPosition)
                    .attr("y", y + shortAxesOffset + shortTickLength + shortFontSize)     
                    .attr("font-size", shortFontSize)
                    .text(axisText)
                    .attr("text-anchor", textAnchor)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        axisText = format(minY + i*ySlice);
        textPosition = y - i*yStep;                  
        
        if(uniqueDataY.length <= numberOfGrooves)
        {
            axisText = uniqueDataY[i];
            textPosition = y - yStep/2 - i*yStep;                    
        }
        canvas.append("line")
                    .attr("x1", x - shortAxesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", x - shortAxesOffset - shortTickLength)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");       
        
        var offset = 0;
        
        if(i == 0)
        {
            offset = -shortFontSize/3;
        }
        else if(i == shortNumberOfGrooves-1)
        {
            offset = shortFontSize/3;
        }
        
        canvas.append("text")
                    .attr("x", x - shortAxesOffset - shortTickTextOffsetYAxis)
                    .attr("y", textPosition + shortTickLength + offset)  
                    .text(axisText)
                    .attr("font-size", shortFontSize + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<dataX.length; i++)
    {
        var X,Y;
        
        if(uniqueDataX.length <= numberOfGrooves)
            X = x + uniqueDataX.indexOf(dataX[i])*xStep + xStep/2;    
        else
            X = x + getValue(dataX[i], minX, maxX)*shortWidth;
            
        if(uniqueDataY.length <= numberOfGrooves)
            Y = y - uniqueDataY.indexOf(dataY[i])*yStep - yStep/2;
        else
            Y = y - getValue(dataY[i], minY, maxY)*shortHeight;
            
        var color = "black";
        
        canvas.append("circle")
                    .attr("cx", X)
                    .attr("cy", Y)
                    .attr("r", shortDataPointRadius)
                    .attr("fill", color)                    
                    .attr("class", "points");     
    }
}

function getValue(number, min, max)
{
    return (number - min)/(max - min);
}