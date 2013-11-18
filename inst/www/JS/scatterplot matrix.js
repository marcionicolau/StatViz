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
        
    var canvas = d3.select("#plotCanvas");    
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var TOP = canvasHeight/2 - plotHeight/2;
    
    if(numberOfVariables >= 2)
    {        
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
                            .attr("fill","orange")
                            .text(currentVariableSelection[i]);
                }
            }
        }
        
        drawButtonInSideBar("PERFORM MULTIPLE REGRESSION", "regression");
    }
}

function makeScatterplotMatrixForMultipleRegression(dependentVariable)
{
    var variableList = sort(currentVariableSelection);
    
    //any number of dependent variables -> should work
    var predictorVariables = [];
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(currentVariableSelection[i] != dependentVariable)
        {
            predictorVariables.push(currentVariableSelection[i]);
        }
    }
    
    var numberOfVariables = currentVariableSelection.length - 1;
    
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
        
    var canvas = d3.select("#plotCanvas");    
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var TOP = canvasHeight/2 - plotHeight/2;
    
    if(numberOfVariables >= 1)
    {        
        for(var i=0; i<numberOfVariables; i++)
        {
            makeScatterPlotAt(LEFT + i*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis), TOP, (plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis), (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis), dependentVariable, predictorVariables[i], "true");             
        }
    }
}

function makeScatterPlotAt(x,y,shortWidth, shortHeight, variableX, variableY, noColor)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    var canvas = d3.select("#plotCanvas");
    
    y = y + shortHeight;

    var dataX = variables[variableX]["dataset"];
    var dataY = variables[variableY]["dataset"];
    
    if(noColor == undefined)
    {
        var r = findCorrelationCoefficient(variableX, variableY);
        
        canvas.append("rect")
                .attr("x", x)
                .attr("y", y-shortHeight)
                .attr("rx", "5px")
                .attr("ry", "5px")
                .attr("width", shortWidth)
                .attr("height", shortHeight)
                .attr("fill", "rgba(0, 255, 0, " + 0.6*Math.abs(r) + ")")                
                .attr("id", getValidId(variableX) + getValidId(variableY))
                .attr("class", "scatterplotMatrixCellRect");
    }
    
    var uniqueDataX = dataX.unique();
    var uniqueDataY = dataY.unique();  

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
    
    //y-axis grooves
    var xStep = uniqueDataX.length <= shortNumberOfGrooves ? shortWidth/numberOfGroovesInXAxis : shortWidth/(numberOfGroovesInXAxis - 1);
    var yStep = uniqueDataY.length <= shortNumberOfGrooves ? shortHeight/numberOfGroovesInYAxis : shortHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);    
    
    //grooves
    
    var axisText, textPosition;
    //x-axis ticks
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = format(minX + i*xSlice);
        textPosition = x + i*xStep;
        
        var textAnchor = "middle";
        
        if(uniqueDataX.length <= shortNumberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = x + xStep/2 + i*xStep;
        }
        else
        {
            if(i == 0)
            {
                textAnchor = "start";
            }
            else if(i == shortNumberOfGrooves-1)
            {
                textAnchor = "end";
            }
        }
        
        canvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", y + shortAxesOffset)
                    .attr("x2", textPosition)
                    .attr("y2", y + shortAxesOffset + shortTickLength)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
                    
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
        var offset = 0;
        
        if(uniqueDataY.length <= shortNumberOfGrooves)
        {
            axisText = uniqueDataY[i];
            textPosition = y - yStep/2 - i*yStep;                    
        }
        else
        {
            if(i == 0)
            {
                offset = -shortFontSize/3;
            }
            else if(i == shortNumberOfGrooves-1)
            {
                offset = shortFontSize/3;
            }
        }
        
        canvas.append("line")
                    .attr("x1", x - shortAxesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", x - shortAxesOffset - shortTickLength)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");       
        
        
        
        
        
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
        
        if(isNaN(dataX[0]))
            X = x + uniqueDataX.indexOf(dataX[i])*xStep + xStep/2;    
        else
            X = x + getValue(dataX[i], minX, maxX)*shortWidth;
            
        if(isNaN(dataY[0]))
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