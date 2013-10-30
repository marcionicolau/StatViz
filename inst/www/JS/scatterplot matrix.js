var mins = new Object();
var maxs = new Object();
   
   
function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    var nPlots = variableList["dependent"].length*variableList["dependent"].length;;
    
    if(variableList["dependent"].length == 2)
    {
        // we'll do just this case for now...
        
        for(var i=0; i<variableList["dependent"].length; i++)
        {
            for(var j=0; j<variableList["dependent"].length; j++)
            {
                if(i != j)
                    makeScatterPlotAt(canvasWidth/2 - size/2 + j*(size/2), canvasHeight/2 + i*(size/2), size/nPlots, variableList["dependent"][i], variableList["dependent"][j]); 
            }
        }
    }
}

function makeScatterPlotAt(x,y,plotSize, variableX, variableY, variableColor)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    
    var canvas = d3.select("#svgCanvas");
    
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
            
    
}

function getValue(number, type)
{
    return (number - mins[type])/(maxs[type] - mins[type]);
}