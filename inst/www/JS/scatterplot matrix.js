var minX, maxX, minY, maxY;

// Scatterplot matrix
var shortAxesOffset, shortTickLength, shortDataPointRadius, shortNumberOfGrooves, shortTickTextOffsetXAxis, shortTickTextOffsetYAxis, shortYAxisTickTextOffset;

function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    var numberOfVariables = variableList["dependent"].length;
    
    // Scatterplot matrix
    shortAxesOffset = axesOffset/numberOfVariables;
    shortTickLength = tickLength/numberOfVariables;
    shortDataPointRadius = datapointRadius/numberOfVariables < 1 ? 1 : datapointRadius/numberOfVariables;
    shortNumberOfGrooves = Math.ceil(numberOfGrooves/(numberOfVariables * 1.5));
    shortTickTextOffsetXAxis = tickTextOffsetXAxis/(numberOfVariables);
    shortTickTextOffsetYAxis = tickTextOffsetYAxis/(numberOfVariables);
    shortYAxisTickTextOffset = yAxisTickTextOffset/numberOfVariables;
    
    var left = canvasWidth/2 - plotWidth/2;
    var top = canvasHeight/2 - plotHeight/2;
    
    if(numberOfVariables >= 2)
    {
        // we'll do just this case for now...
        
        for(var i=0; i<numberOfVariables; i++)
        {
            for(var j=0; j<numberOfVariables; j++)
            {
                if(i != j)
                    makeScatterPlotAt(left + j*((plotWidth + numberOfVariables*(axesOffset + tickTextOffsetYAxis))/numberOfVariables), top + i*((plotHeight + numberOfVariables*(axesOffset + tickTextOffsetXAxis))/numberOfVariables), (plotWidth/numberOfVariables), (plotHeight/numberOfVariables), variableList["dependent"][i], variableList["dependent"][j]); 
            }
        }
    }
}

function makeScatterPlotAt(x,y,shortWidth, shortHeight, variableX, variableY, variableColor)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    var canvas = d3.select("#svgCanvas");
    canvas.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("height", shortHeight)
            .attr("width", shortWidth)
            .attr("fill", "none")
            .attr("stroke", "yellow");
            
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
    
    var xStep = shortWidth/(shortNumberOfGrooves-1);
    var yStep = shortHeight/(shortNumberOfGrooves-1);
    
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);    
    
    //grooves
    
    //x-axis ticks
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x + i*xStep)
                    .attr("y1", y + shortAxesOffset)
                    .attr("x2", x + i*xStep)
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
                    .attr("x", x + i*xStep)
                    .attr("y", y + shortAxesOffset + tickTextOffsetXAxis)     
                    .attr("font-size", fontSize)
                    .text(format(minX + i*xSlice))
                    .attr("text-anchor", textAnchor)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x - shortAxesOffset)
                    .attr("y1", y - i*yStep)
                    .attr("x2", x - shortAxesOffset - shortTickLength)
                    .attr("y2", y - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");       
        
        var offset = 0;
        
        if(i == 0)
        {
            offset = -shortYAxisTickTextOffset;
        }
        else if(i == shortNumberOfGrooves-1)
        {
            offset = shortYAxisTickTextOffset;
        }
        
        canvas.append("text")
                    .attr("x", x - shortAxesOffset - tickTextOffsetYAxis)
                    .attr("y", y - i*yStep + shortYAxisTickTextOffset + offset)  
                    .text(format(minY + i*ySlice))
                    .attr("font-size", fontSize + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<dataX.length; i++)
    {
        var color = "black";
        
        canvas.append("circle")
                    .attr("cx", x + getValue(dataX[i], minX, maxX)*shortWidth)
                    .attr("cy", y - getValue(dataY[i], minY, maxY)*shortHeight)
                    .attr("r", shortDataPointRadius)
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function getValue(number, min, max)
{
    return (number - min)/(max - min);
}