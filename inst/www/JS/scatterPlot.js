//boundaries    
var LEFT;
var RIGHT;

var TOP;
var BOTTOM;

var data = new Object(); 
var mins = new Object();
var maxs = new Object();

var uniqueDataX, uniqueDataY;
var xStep, yStep;
    
   
function makeScatterplot()
{   
    LEFT = canvasWidth/2 - plotWidth/2;
    RIGHT = canvasWidth/2 + plotWidth/2;

    TOP = canvasHeight/2 - plotHeight/2 - topOffset;
    BOTTOM = canvasHeight/2 + plotHeight/2 - topOffset;


    data["X"] = variables[currentVariableSelection[0]]["dataset"];
    data["Y"] = variables[currentVariableSelection[1]]["dataset"];
    
    mins["X"] = MIN[currentVariableSelection[0]]["dataset"];
    mins["Y"] = MIN[currentVariableSelection[1]]["dataset"];
    
    maxs["X"] = MAX[currentVariableSelection[0]]["dataset"];
    maxs["Y"] = MAX[currentVariableSelection[1]]["dataset"];
    

    getCorrelationCoefficient(currentVariableSelection[0], currentVariableSelection[1]);

    
    var colorData;
    var uniqueColorData;
    
    var colorsForPlot = new Object();
    var varNames = [];
    
    if((currentVariableSelection.length == 3))
    {
        if(parseInt(variables[currentVariableSelection[2]]["dataset"].unique().length) <= 10)
        {
            colorData = variables[currentVariableSelection[2]]["dataset"];
            uniqueColorData = colorData.unique();
        
            for(var i=0; i<uniqueColorData.length; i++)
            {
                colorsForPlot[uniqueColorData[i]] = colors[i];
                varNames[i] = uniqueColorData[i];
            }
            drawScatterPlotLegends(varNames);
        }
    }    
    
    var ids = currentVariableSelection;
     
    var canvas = d3.select("#svgCanvas");
    
    // Draw axes
        
    canvas.append("line")
              .attr("x1", LEFT)
              .attr("y1", BOTTOM + axesOffset)
              .attr("x2", RIGHT)
              .attr("y2", BOTTOM + axesOffset) 
              .attr("stroke", "black")
              .attr("id", "xAxis")
              .attr("class", "axes");
              
    canvas.append("text")
                .attr("x", (LEFT + RIGHT)/2)
                .attr("y", BOTTOM + axesOffset + labelOffset)
                .attr("text-anchor", "middle")
                .attr("font-size", "24px")
                .text(currentVariableSelection[0])
                .attr("fill", "orange");
    
    canvas.append("line")
              .attr("x1", LEFT - axesOffset)
              .attr("y1", TOP)
              .attr("x2", LEFT - axesOffset)
              .attr("y2", BOTTOM)
              .attr("stroke", "black")
              .attr("id", "yAxis")              
              .attr("class", "axes");
    
    canvas.append("text")
                .attr("x", LEFT - axesOffset - labelOffset)
                .attr("y", (TOP + BOTTOM)/2 + 6)
                .attr("text-anchor", "end")
                .attr("font-size", "24px")
                .text(currentVariableSelection[1])
                .attr("fill", "orange");
                                    
    
    //grooves
    
    uniqueDataX = data["X"].unique();
    uniqueDataY = data["Y"].unique();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > numberOfGrooves ? numberOfGrooves : uniqueDataX.length;
    var numberOfGroovesInYAxis = uniqueDataY.length > numberOfGrooves ? numberOfGrooves : uniqueDataY.length;
    
    //y-axis grooves
    xStep = uniqueDataX.length <= numberOfGrooves ? plotWidth/numberOfGroovesInXAxis : plotWidth/(numberOfGroovesInXAxis - 1);
    yStep = uniqueDataY.length <= numberOfGrooves ? plotHeight/numberOfGroovesInYAxis : plotHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxs["X"] - mins["X"])/(numberOfGroovesInXAxis - 1);    
    var ySlice = (maxs["Y"] - mins["Y"])/(numberOfGroovesInYAxis - 1);    
    
    var axisText, textPosition;
    //grooves
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = format(mins["X"] + i*xSlice);
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
        axisText = format(mins["Y"] + i*ySlice);
        textPosition = BOTTOM - i*yStep;                  
        
        if(uniqueDataY.length <= numberOfGrooves)
        {
            axisText = uniqueDataY[i];
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
    
    for(var i=0; i<data["X"].length; i++)
    {
        var x,y;
        
        if(uniqueDataX.length <= numberOfGrooves)
            x = LEFT + uniqueDataX.indexOf(data["X"][i])*xStep + xStep/2;    
        else
            x = LEFT + getValue1(data["X"][i], mins["X"], maxs["X"])*plotWidth;
            
        if(uniqueDataY.length <= numberOfGrooves)
            y = BOTTOM - uniqueDataY.indexOf(data["Y"][i])*yStep - yStep/2;
        else
            y = BOTTOM - getValue1(data["Y"][i], mins["Y"], maxs["Y"])*plotHeight;
        
        
        
        var color = getObjectLength(colorsForPlot) > 0 ? colorsForPlot[colorData[i]] : "black";        
        
        canvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", datapointRadius)
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function drawRegressionLine(intercept, slope)
{
    var canvas = d3.select("#svgCanvas");
    
    var x,y;
        
    if(uniqueDataX.length <= numberOfGrooves)
        x = LEFT + uniqueDataX.indexOf(intercept)*xStep + xStep/2;    
    else
        x = LEFT + getValue1(intercept, mins["X"], maxs["X"])*plotWidth;
        
    if(uniqueDataY.length <= numberOfGrooves)
        y = BOTTOM - uniqueDataY.indexOf(0)*yStep - yStep/2;
    else
        y = BOTTOM - getValue1(0, mins["Y"], maxs["Y"])*plotHeight;
            
    canvas.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", datapointRadius)
            .attr("fill", "magenta");
            
}

function getValue1(number, min, max)
{
    return (number - min)/(max - min);
}

function drawScatterPlotLegends(varNames)
{
    var canvas = d3.select("#svgCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("circle")
                .attr("cx", RIGHT + histLegendOffsetX)
                .attr("cy", TOP + histLegendOffsetY + i*yStep)
                .attr("r", datapointRadius)
                .attr("fill", colors[i])
                .attr("id", "legend" + i)
                .attr("class", "circles");
        
        canvas.append("text")
                .attr("x", RIGHT + 2*histLegendOffsetX + histLegendSize)
                .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
                .attr("fill", "black")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "text");
            
    }
}