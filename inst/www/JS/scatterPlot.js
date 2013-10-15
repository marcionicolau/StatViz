function makeScatterplot()
{
    var data = new Object();
    var mins = new Object();
    var maxs = new Object();
    
    
    //Get data, minimums and maximums for each selected variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        if(i == 0)
        {
            data["X"] = variables[currentVariableSelection[i]];      
            mins["X"] = MIN[currentVariableSelection[i]];      
            maxs["X"] = MAX[currentVariableSelection[i]];      
        }
        if(i == 1)
        {
            data["Y"] = variables[currentVariableSelection[i]];      
            mins["Y"] = MIN[currentVariableSelection[i]];      
            maxs["Y"] = MAX[currentVariableSelection[i]];      
        }
    }
    
    min = Array.min([mins["X"], mins["Y"]]);
    max = Array.max([maxs["X"], maxs["Y"]]);
    
    var canvas = d3.select("#svgCanvas");

    // changeable
    var nGrooves = 10;
    
    //draw axes
    var xAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 - size/2)
                                    .attr("x2", canvasWidth/2 - size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                                    .attr("x1", canvasWidth/2 - size/2)
                                    .attr("y1", canvasHeight/2 + size/2)
                                    .attr("x2", canvasWidth/2 + size/2)
                                    .attr("y2", canvasHeight/2 + size/2)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "axes");
                                    
    
    //grooves
    
    //todo: x-axis grooves
    
    //y-axis grooves
    var step = size/(nGrooves-1);
    var xSlice = (maxs["X"] - mins["X"])/(nGrooves-1);    
    var ySlice = (maxs["Y"] - mins["Y"])/(nGrooves-1);    
    
    //grooves
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 + i*step)
                    .attr("y1", canvasHeight/2 + size/2 - 5)
                    .attr("x2", canvasWidth/2 - size/2 + i*step)
                    .attr("y2", canvasHeight/2 + size/2 + 5)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 + i*step - 15)
                    .attr("y", canvasHeight/2 + size/2 + 30)                    
                    .text(format(mins["X"] + i*xSlice))
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<nGrooves; i++)
    {
        canvas.append("line")
                    .attr("x1", canvasWidth/2 - size/2 - 5)
                    .attr("y1", canvasHeight/2 + size/2 - i*step)
                    .attr("x2", canvasWidth/2 - size/2 + 5)
                    .attr("y2", canvasHeight/2 + size/2 - i*step)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", canvasWidth/2 - size/2 - 55)
                    .attr("y", canvasHeight/2 + size/2 - i*step)                    
                    .text(format(mins["Y"] + i*ySlice))
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<data["X"].length; i++)
    {
        canvas.append("circle")
                    .attr("cx", canvasWidth/2 - size/2 + getValue(data["X"][i], "X")*size)
                    .attr("cy", canvasHeight/2 - size/2 + getValue(data["Y"][i], "Y")*size)
                    .attr("r", "2px")
                    .attr("fill", "grey");     
    }
}

function getValue(number, type)
{
    return (number - min[type])/(max[type] - min[type]);
}