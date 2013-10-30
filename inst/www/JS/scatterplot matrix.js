var minX, maxX, minY, maxY;

// Scatterplot matrix
var shortAxesOffset, shortTickLength, shortDataPointRadius, shortNumberOfGrooves, shortTickTextOffsetXAxis, shortTickTextOffsetYAxis;

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
    
    
    if(numberOfVariables == 2)
    {
        // we'll do just this case for now...
        
        for(var i=0; i<numberOfVariables; i++)
        {
            for(var j=0; j<numberOfVariables; j++)
            {
                if(i != j)
                    makeScatterPlotAt(canvasWidth/2 - size/2 + j*(size/2), canvasHeight/2 + i*(size/2), (size/numberOfVariables) - axesOffset, variableList["dependent"][i], variableList["dependent"][j]); 
            }
        }
    }
}

function makeScatterPlotAt(x,y,plotSize, variableX, variableY, variableColor)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    
    var canvas = d3.select("#svgCanvas");
    
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
            .attr("x2", x + plotSize)
            .attr("y2", y + shortAxesOffset)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "xAxis");
    
    // y-axis
    canvas.append("line")
            .attr("x1", x - shortAxesOffset)
            .attr("y1", y)
            .attr("x2", x - shortAxesOffset)
            .attr("y2", y - plotSize)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "yAxis");
    
    var step = plotSize/(shortNumberOfGrooves-1);
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);    
    
    //grooves
    
    //x-axis ticks
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x + i*step)
                    .attr("y1", y + shortAxesOffset)
                    .attr("x2", x + i*step)
                    .attr("y2", y + shortAxesOffset + shortTickLength)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", x + i*step)
                    .attr("y", y + shortAxesOffset + shortTickTextOffsetXAxis)     
                    .attr("font-size", fontSize)
                    .text(format(minX + i*xSlice))
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<shortNumberOfGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x - shortAxesOffset)
                    .attr("y1", y - i*step)
                    .attr("x2", x - shortAxesOffset - shortTickLength)
                    .attr("y2", y - i*step)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", x - shortTickTextOffsetYAxis)
                    .attr("y", y - i*step)  
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
                    .attr("cx", x + getValue(dataX[i], minX, maxX)*plotSize)
                    .attr("cy", y - getValue(dataY[i], minY, maxY)*plotSize)
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