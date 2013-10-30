var mins = new Object();
var maxs = new Object();


var spmFontSize;
   
   
function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    var numberOfVariables = variableList["dependent"].length;
    
    //scale some variables
    var spmFontSize = fontSize/2;
    
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
    
    canvas.append("rect")
            .attr("x", x)
            .attr("y", y - plotSize)
            .attr("height", plotSize)
            .attr("width", plotSize)
            .attr("stroke", "yellow")
            .attr("fill", "none");
    
    //may be you can calculate this in makeScatterPlot()
    var maxX = MAX[variableX]["dataset"];
    var minX = MIN[variableX]["dataset"];
    
    var maxY = MAX[variableY]["dataset"];
    var minY = MIN[variableY]["dataset"];
    
    // x-axis
    canvas.append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x + plotSize)
            .attr("y2", y)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "xAxis");
    
    // y-axis
    canvas.append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x)
            .attr("y2", y - plotSize)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "yAxis");
            
    var nGrooves = 10;
    
    var step = plotSize/(nGrooves-1);
    var xSlice = (maxX - minX)/(nGrooves-1);    
    var ySlice = (maxY - minY)/(nGrooves-1);    
    
    //grooves
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x + i*step)
                    .attr("y1", y)
                    .attr("x2", x + i*step)
                    .attr("y2", y + 10)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", x + i*step)
                    .attr("y", y)     
                    .attr("font-size", spmFontSize + "px")
                    .text(format(minX + i*xSlice))
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", x)
                    .attr("y1", y - i*step)
                    .attr("x2", x - 10)
                    .attr("y2", y - i*step)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", x)
                    .attr("y", y - i*step)  
                    .text(format(minY + i*ySlice))
                    .attr("font-size", spmFontSize + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
}

function getValue(number, type)
{
    return (number - mins[type])/(maxs[type] - mins[type]);
}