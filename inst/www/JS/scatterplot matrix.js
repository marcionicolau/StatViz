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
    
    if(numberOfVariables == 3)
    {
        shortFontSize = fontSize - 3;
    }
    if(numberOfVariables > 3)
    {
        shortFontSize = 0;
    }
        
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
                    makeScatterPlotAt(LEFT + j*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis), TOP + i*((plotHeight/numberOfVariables) + shortAxesOffset + shortTickTextOffsetXAxis), (plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis), (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis), currentVariableSelection[j], currentVariableSelection[i]); 
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

    var dataX = variables[variableX]["dataset"];
    var dataY = variables[variableY]["dataset"];
    
    var uniqueDataX = dataX.unique();
    var uniqueDataY = dataY.unique();  
    
    console.log("unique data length (" + variableX + ")=" + uniqueDataX.length);
    console.log("unique data length (" + variableY + ")=" + uniqueDataY.length);
    
    console.log("short number of grooves=" + shortNumberOfGrooves);
    
    var minX=0, minY=0, maxX=0, maxY=0;
    
    if(!isNaN(dataX[0]))
    {
        maxX = MAX[variableX]["dataset"];        
        minX = MIN[variableX]["dataset"];
    }
    
    if(!isNaN(dataY[0]))
    {
        maxY = MAX[variableY]["dataset"];
        minY = MIN[variableY]["dataset"];
    }
    
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
    
    var numberOfGroovesInXAxis = uniqueDataX.length <= shortNumberOfGrooves ? uniqueDataX.length : shortNumberOfGrooves;
    var numberOfGroovesInYAxis = uniqueDataY.length <= shortNumberOfGrooves ? uniqueDataY.length : shortNumberOfGrooves;
    
    console.log("\nnumber of grooves in x-axis=" + numberOfGroovesInXAxis);
    console.log("number grooves in y-axis=" + numberOfGroovesInYAxis);
    
    //y-axis grooves
    var xStep = uniqueDataX.length <= shortNumberOfGrooves ? shortWidth/numberOfGroovesInXAxis : shortWidth/(numberOfGroovesInXAxis - 1);
    var yStep = uniqueDataY.length <= shortNumberOfGrooves ? shortHeight/numberOfGroovesInYAxis : shortHeight/(numberOfGroovesInYAxis - 1);
    
    console.log("\nX-step=" + xStep);
    console.log("Y-step=" + yStep);
    
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);    
    
    //grooves
    
    var axisText, textPosition;
    //x-axis ticks
    for(i=0; i<numberOfGroovesInXAxis; i++)
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
    
    for(i=0; i<numberOfGroovesInYAxis; i++)
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
    
//     for(var i=0; i<dataX.length; i++)
//     {
//         var X,Y;
//         
//         if(isNaN(dataX[0]))
//             X = x + uniqueDataX.indexOf(dataX[i])*xStep + xStep/2;    
//         else
//             X = x + getValue(dataX[i], minX, maxX)*shortWidth;
//             
//         if(isNaN(dataY[0]))
//             Y = y - uniqueDataY.indexOf(dataY[i])*yStep - yStep/2;
//         else
//             Y = y - getValue(dataY[i], minY, maxY)*shortHeight;
//             
//         var color = "black";
//         
//         canvas.append("circle")
//                     .attr("cx", X)
//                     .attr("cy", Y)
//                     .attr("r", shortDataPointRadius)
//                     .attr("fill", color)                    
//                     .attr("class", "points");     
//     }
}

function getValue(number, min, max)
{
    return (number - min)/(max - min);
}